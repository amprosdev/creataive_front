import {
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';
import Loadable from 'react-loadable';
import Loading from './Loading';

const Layout = Loadable({
  loader: () => import('@/layouts/default'),
  loading: Loading
});

const NoSidebar = Loadable({
  loader: () => import('@/layouts/no-sidebar'),
  loading: Loading
});

const Document = Loadable({
  loader: () => import('@/pages/Document'),
  loading: Loading
});

const Dashboard = Loadable({
  loader: () => import('@/pages/Dashboard'),
  loading: Loading
});

const Project = Loadable({
  loader: () => import('@/pages/Project'),
  loading: Loading
});

const History = Loadable({
  loader: () => import('@/pages/History'),
  loading: Loading
});

const Articles = Loadable({
  loader: () => import('@/pages/Articles'),
  loading: Loading
});

const Settings = Loadable({
  loader: () => import('@/pages/Settings'),
  loading: Loading
});

const Library = Loadable({
  loader: () => import('@/pages/Library'),
  loading: Loading
});

const Assets = Loadable({
  loader: () => import('@/pages/Assets'),
  loading: Loading
});

const PPT = Loadable({
  loader: () => import('@/pages/PPT'),
  loading: Loading
});

const PPTEditor = Loadable({
  loader: () => import('@/pages/PPTEditor'),
  loading: Loading
});

const PPTPreview = Loadable({
  loader: () => import('@/pages/PPTPreview'),
  loading: Loading
});

const Help = Loadable({
  loader: () => import('@/pages/Help'),
  loading: Loading
});

const router = createBrowserRouter([
  {
    path: "/main",
    element: <Layout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'project/:id',
        element: <Project />
      },
      {
        path: 'history',
        element: <History />
      },
      {
        path: 'articles',
        element: <Articles />
      },
      {
        path: 'settings',
        element: <Settings />
      },
      {
        path: 'help',
        element: <Help />
      },
      {
        path: 'library',
        element: <Library />
      },
      {
        path: 'assets',
        element: <Assets />
      },
      {
        path: 'ppt',
        element: <PPT />
      },
    ],
  },
  {
    path: '/',
    element: <NoSidebar />,
    children: [
      {
        path: 'document/:id',
        element: <Document />,
      },
      {
        path: 'ppt-editor/:id',
        element: <PPTEditor />
      },
      {
        path: 'ppt-preview/:id',
        element: <PPTPreview />
      },
      {
        path: '',
        element: <Navigate to="/main/dashboard"/>
      },
    ]
  },
]);
export default  router;
