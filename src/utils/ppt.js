const BASE_URL = 'https://mano-1315917957.cos.ap-shanghai.myqcloud.com/ppt'

function getImageUrl(image) {
  return image ? BASE_URL + image : '';
}

const themeList = [
  'white',
  'simple',
  'solarized',
  'beige',
  'serif',
  'sky',
  'moon',
  'dracula',
  'league',
  'black',
  'blood',
  'night',
]

function parseTokens(tokens) {
  try {

    const stack = [];
    const treeData = [];

    let currentNode = null;

    for (const [index, token] of tokens.entries()) {
      if (token.type === 'heading_open' || (index === 0 && token.type === 'paragraph_open')) {
        const headingText = tokens[tokens.indexOf(token) + 1].content;
        const headingLevel = parseInt(token.tag.slice(1), 10) || 1; // Remove the 'h' from the tag (e.g., 'h1' -> '1')

        const newNode = {
          id: index.toString(),
          content: headingText,
          level: headingLevel,
          children: [],
          contentType: checkContentType(headingText),
          type: checkContentType(headingText),
        };

        if (currentNode && currentNode.level < headingLevel) {
          currentNode.children.push(newNode);
          stack.push(currentNode);
        } else {
          while (stack.length > 0 && stack[stack.length - 1].level >= headingLevel) {
            stack.pop();
          }

          if (stack.length > 0) {
            stack[stack.length - 1].children.push(newNode);
          } else {
            treeData.push(newNode);
          }

          stack.push(newNode);
        }

        currentNode = newNode;
      } else if (currentNode && token.type === 'inline') {
        const pContent = currentNode.content;
        if (pContent !== token.content) {
          const leafNode = {
            id: index.toString(),
            content: token.content,
            level: currentNode.level + 1,
            children: [],
            contentType: checkContentType(token.content),
            type: checkContentType(token.content),
          };

          currentNode.children.push(leafNode);
        }
      }
    }
    return {
      docTree: treeData.length === 1 ? treeData[0].children : treeData,
      docContent: flattenData(treeData.length === 1 ? treeData[0].children : treeData),
      title: treeData[0].content
    }
  } catch (e) {
    console.log(e);
    return {
      docTree: [],
      docContent: [],
      title: ''
    }
  }
}


function checkContentType(content) {
  // 使用正则表达式匹配图片链接格式
  const imageRegex = /!\[.*\(.+\)/;

  if (imageRegex.test(content)) {
    return "image";
  } else {
    return "text";
  }
}

function flattenData(inputData, isTopLevel = true) {
  let outputData = [];

  for (let item of inputData) {
    // 如果是顶层节点，将其单独添加到结果中
    if (isTopLevel) {
      outputData.push({...item, parent: 'root', children: []});
    }

    // 如果有children，添加到结果中并递归处理
    if (item.children && item.children.length > 0) {
      let newItem = {
        ...item,
        id: item.id + '-root',
        children: item.children.map(child => ({...child, children: []})),
      };
      outputData.push(newItem);
      outputData = outputData.concat(flattenData(item.children, false));
    }
  }

  return outputData;
}

const loadCSS = (url) => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
  return link;
};

const loadTheme = (theme) => {
  return loadCSS(`/dist/reveal/theme/${theme}.css`);
};

/**
 * 获取指定节点及其父节点的 content
 * @param treedata
 * @param id
 * @returns {*}
 */
function getContentWithParents(treedata, id) {
  treedata = treedata[0];

  // 递归函数用于查找指定节点及其父节点的 content
  function findContent(node, id, parentContent) {
    if (node.id === id) {
      return parentContent + '-' + node.content;
    }

    if (node.children && node.children.length > 0) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const content = parentContent !== '' ? parentContent + '-' + node.content : node.content;
        const result = findContent(child, id, content);

        if (result) {
          return result;
        }
      }
    }

    return null;
  }

  // 在整个 treedata 中查找指定 id 的 content
  return findContent(treedata, id, '');
}

/**
 * 查找节点
 * @param dataList
 * @param id
 * @returns {null}
 */
function findItem(dataList, id) {
  let result = null;
  dataList.forEach(item => {
    const loop = data => {
      if (String(data.id) === String(id)) {
        result = data;
        return result;
      }

      const childs = data.children;

      if (childs) {
        for (let i = 0; i < childs.length; i += 1) {
          loop(childs[i]);
        }
      }
    };

    loop(item);
  });

  return result;
}

export {
  getImageUrl,
  themeList,
  getContentWithParents,
  parseTokens,
  flattenData,
  loadCSS,
  loadTheme,
  findItem
}
