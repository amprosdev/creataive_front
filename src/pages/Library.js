import LibraryList from '@/features/library-list';
import {FormattedMessage} from "react-intl";
const PageLibrary = () => {
  return (
    <>
      <h1><FormattedMessage id="menu.library" /></h1>
      <LibraryList />
    </>
  );
};
export default PageLibrary;
