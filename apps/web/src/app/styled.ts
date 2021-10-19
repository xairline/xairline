import styled from 'styled-components';
export const Style = styled.div`
  .ant-layout {
    background: url('assets/airport_night.jpg');
    .ant-layout-sider {
      color: #232424;
      box-shadow: 1px 0 20px -5px gray;
      background: #232424;
      .ant-menu,
      .ant-layout-sider-trigger {
        background: transparent;
        color: #232424;
      }
      .ant-menu {
        .ant-menu-item {
          font-size: 16px;
          height: 50px;
          line-height: 50px;
          &.ant-menu-item-selected {
            background: #006363;
            a {
              color: #fff;
            }
          }
        }
      }
      .logo {
        border-radius: 6px;
        margin: 8px;
        transition: all 0.5s;
        overflow: hidden;
        text-align: center;
        background: rgba(255, 255, 255, 0.3);
        color: #6d9eeb;
        height: 5vh;
        align-items: center;
        justify-content: center;
        display: flex;
        padding: 8px;
        img {
          border-radius: 50%;
          max-width: 60px;
          max-height: 60px;
          width: 100%;
          height: 100%;
        }
      }
      &.ant-layout-sider-collapsed {
        .ant-menu.ant-menu-sub {
          background: #333;
        }
        .logo {
          height: 32px;
        }
      }
      .ant-layout-sider-collapsed .anticon {
        font-size: 16px;
        margin-left: 8px;
      }

      .ant-layout-sider-collapsed .nav-text {
        display: none;
      }

      .ant-layout-sider-collapsed
        .ant-menu-submenu-vertical
        > .ant-menu-submenu-title:after {
        display: none;
      }
    }

    & > .ant-layout {
      overflow: auto;
      background: transparent;
      .ant-layout-header {
        display: flex;
        align-items: center;

        box-shadow: 0 1px 10px -4px gray;
        line-height: normal;
        .placeholder {
          flex-grow: 1;
        }
        .user-info {
          .user,
          .group {
            padding: 0 16px;
            font-size: 18px;
          }
        }
      }
      .main-content {
        margin: 10px;
        background: transparent;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
      }
    }
    .ant-form-item-explain.ant-form-item-explain-error {
      color: #b2b206;
    }
    .ant-form-item-has-error :not(.ant-input-disabled).ant-input,
    .ant-form-item-has-error
      :not(.ant-input-affix-wrapper-disabled).ant-input-affix-wrapper,
    .ant-form-item-has-error :not(.ant-input-disabled).ant-input:hover,
    .ant-form-item-has-error
      :not(.ant-input-affix-wrapper-disabled).ant-input-affix-wrapper:hover {
      background-color: transparent;
      border-color: #b2b206;
    }
    .ant-form-item-label
      > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before {
      display: inline-block;
      margin-right: 4px;
      color: #b2b206;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
    .user {
      vertical-align: middle;
    }

    .ant-table-wrapper {
      background: #1d1d1d;
    }
  }
  .ant-table-pagination.ant-pagination {
    margin-right: 20px;
  }
`;
