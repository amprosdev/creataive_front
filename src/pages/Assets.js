import AssetsList from '@/features/assets-list';
import {FormattedMessage} from "react-intl";
import UploadAsset from "../components/common/UploadAsset";
import {Space} from "antd";
const PageAssets = () => {
  return (
    <>
      <Space>
        <h1><FormattedMessage id="menu.assets" /></h1>
        <UploadAsset />
      </Space>
      <AssetsList />
    </>
  );
};
export default PageAssets;
