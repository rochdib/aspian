import React, {
  useState,
  ReactText,
  FC,
  useEffect,
  Fragment,
  MouseEvent,
} from 'react';
import {
  Table,
  Button,
  Space,
  Tooltip,
  Row,
  Col,
  Typography,
  Popconfirm,
  message,
  Input,
  DatePicker,
  Slider,
} from 'antd';
import { TableRowSelection, ColumnsType } from 'antd/lib/table/interface';
import { RangeValue, EventValue } from 'rc-picker/lib/interface';
import {
  EditFilled,
  DeleteFilled,
  ClockCircleFilled,
  SearchOutlined,
  CalendarFilled,
  ControlOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import '../../../../scss/aspian-core/pages/posts/all-posts/_all-posts.scss';
import { connect } from 'react-redux';
import {
  ITaxonomyPost,
  TaxonomyTypeEnum,
  PostStatusEnum,
} from '../../../../app/models/aspian-core/post';
import { IStoreState } from '../../../../app/stores/reducers';
import {
  getPostsEnvelope,
  setLoading,
} from '../../../../app/stores/actions/aspian-core/post/posts';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import moment, { Moment } from 'moment';
import jalaliMoment from 'jalali-moment';
import { IPostState } from '../../../../app/stores/reducers/aspian-core/post/posts';
import { WithTranslation, Trans, withTranslation } from 'react-i18next';
import Title from 'antd/lib/typography/Title';
import Paragraph from 'antd/lib/typography/Paragraph';
import Text from 'antd/lib/typography/Text';
import {
  LanguageActionTypeEnum,
  DirectionActionTypeEnum,
} from '../../../../app/stores/actions/aspian-core/locale/types';
import { SorterResult, ColumnType } from 'antd/es/table/interface';
import { UAParser } from 'ua-parser-js';
import Highlighter from 'react-highlight-words';

import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import PesianDatePicker, { DayRange } from 'react-modern-calendar-datepicker';
import '../../../../scss/aspian-core/components/modern-calendar/_persian-datepicker.scss';
import { e2p } from '../../../../js/aspian-core/base/numberConverter';

interface IProps extends WithTranslation {
  postsState: IPostState;
  getPostsEnvelope: Function;
  lang: LanguageActionTypeEnum;
  dir: DirectionActionTypeEnum;
  setLoading: Function;
}

interface IPostAntdTable {
  key: number;
  title: string;
  postCategory: string[];
  postStatus: PostStatusEnum;
  postAttachments: number;
  commentAllowed: JSX.Element;
  viewCount: number;
  pinned: JSX.Element;
  postHistories: number;
  comments: number;
  childPosts: number;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
  //userAgent: string;
  device: string | undefined;
  os: string | undefined;
  browser: string | undefined;
  userIPAddress: string;
}

const { RangePicker } = DatePicker;

const PostList: FC<IProps> = ({
  postsState,
  getPostsEnvelope,
  t,
  lang,
  dir,
  setLoading,
}) => {
  // Constants
  /// Default page size
  const DFAULT_PAGE_SIZE = 10;
  /// Columns dataIndexes
  const TITLE = 'title';
  const CATEGORY = 'postCategory';
  const STATUS = 'postStatus';
  const ATTACHMENTS = 'postAttachments';
  const COMMENT_ALLOWED = 'commentAllowed';
  const VIEW_COUNT = 'viewCount';
  const PINNED = 'pinned';
  const HISTORIES = 'postHistories';
  const COMMENTS = 'comments';
  const CHILD_POSTS = 'childPosts';
  const CREATED_AT = 'createdAt';
  const CREATED_BY = 'createdBy';
  const MODIFIED_AT = 'modifiedAt';
  const MODIFIED_BY = 'modifiedBy';
  const USER_AGENT = 'userAgent';
  const USER_AGENT_DEVICE = 'device';
  const USER_AGENT_OS = 'os';
  const USER_AGENT_BROWSER = 'browser';
  const IP_ADDRESS = 'userIPAddress';
  const ACTIONS = 'actions';
  // Colomn arrays with different types of filters
  /// Columns with search filter
  const SEARCH_FILTERED_COLUMNS: string[] = [
    TITLE,
    CATEGORY,
    STATUS,
    COMMENT_ALLOWED,
    PINNED,
    IP_ADDRESS,
    CREATED_BY,
    MODIFIED_BY,
    USER_AGENT_DEVICE,
    USER_AGENT_OS,
    USER_AGENT_BROWSER,
  ];
  /// Columns with DateRange filter
  const DATERANGE_FILTERED_COLUMNS: string[] = [CREATED_AT, MODIFIED_AT];
  /// Columns with slider filter
  const SLIDER_FILTERED_COLUMNS: string[] = [
    ATTACHMENTS,
    VIEW_COUNT,
    HISTORIES,
    COMMENTS,
    CHILD_POSTS,
  ];

  // UseStates
  const [selectedRowKeys, setSelectedRowKeys] = useState<ReactText[]>([]);
  const [searchText, setSearchText] = useState<React.ReactText>('');
  const [dateRange, setDateRange] = useState<
    [EventValue<Moment>, EventValue<Moment>]
  >([null, null]);
  const [searchedColumn, setSearchedColumn] = useState<
    string | number | React.ReactText[] | undefined
  >('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [selectedDayRange, setSelectedDayRange] = useState<DayRange>({
    from: null,
    to: null,
  });

  // On select a row event
  const onSelectChange = (selectedRowKeys: ReactText[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  // Row selection functionality implementation
  const rowSelection: TableRowSelection<object> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      {
        key: 'odd',
        text: (
          <Trans>
            {t('post-list.row-selection-menu.items.select-odd-row')}
          </Trans>
        ),
        onSelect: (changableRowKeys: ReactText[]) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((key, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: (
          <Trans>
            {t('post-list.row-selection-menu.items.select-even-row')}
          </Trans>
        ),
        onSelect: (changableRowKeys: ReactText[]) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((key, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  // Custom slider filter functionality implementation
  const getColumnSearchPropsForSliderFilter = (
    dataIndex: string,
    maxNumber: number
  ): ColumnType<any> => ({
    filterDropdown: ({ setSelectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Slider
          range
          step={1}
          max={maxNumber + 50}
          defaultValue={[0, maxNumber > 20 ? maxNumber : 30]}
          onAfterChange={(value) => {
            if (value) {
              setSelectedKeys([value[0], value[1]]);
            }
          }}
        />
        <div>
          <div style={{ marginTop: '10px' }}>
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearchDateRange(confirm, dataIndex)}
                icon={<FilterOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Filter
              </Button>
              <Button
                onClick={() => handleReset(clearFilters)}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
            </Space>
          </div>
        </div>
      </div>
    ),
    filterIcon: (filtered) => (
      <ControlOutlined
        style={{ color: filtered ? '#1890ff' : undefined, fontSize: '13px' }}
      />
    ),
  });

  // Custom date range filter functionality implementation
  const getColumnSearchPropsForDateRangeFilter = (
    dataIndex: string
  ): ColumnType<any> => ({
    filterDropdown: ({ setSelectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        {lang === LanguageActionTypeEnum.fa && (
          <Fragment>
            <PesianDatePicker
              inputPlaceholder="از تاریخ --- تا تاریخ"
              value={selectedDayRange}
              onChange={setSelectedDayRange}
              shouldHighlightWeekends
              locale="fa"
              calendarPopperPosition="bottom"
              calendarClassName="persian-datepicker"
              inputClassName="persian-datepicker-input"
            />

            <div>
              <div style={{ marginTop: '10px' }}>
                <Space>
                  <Button
                    type="primary"
                    onClick={() => {
                      const fromDay = selectedDayRange.from?.day;
                      const fromMonth = selectedDayRange.from?.month;
                      const fromYear = selectedDayRange.from?.year;

                      const toDay = selectedDayRange.to?.day;
                      const toMonth = selectedDayRange.to?.month;
                      const toYear = selectedDayRange.to?.year;

                      const fromInput = `${fromYear}/${fromMonth}/${fromDay}`;
                      const toInput = `${toYear}/${toMonth}/${toDay}`;

                      const from = jalaliMoment
                        .from(fromInput, 'fa', 'YYYY/MM/DD')
                        .locale('en')
                        .format('YYYY/MM/DD');

                      const to = jalaliMoment
                        .from(toInput, 'fa', 'YYYY/MM/DD')
                        .locale('en')
                        .format('YYYY/MM/DD');

                      setSelectedKeys([from, to]);

                      confirm();
                      setSearchedColumn(dataIndex);
                    }}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90 }}
                  >
                    Search
                  </Button>
                  <Button
                    onClick={() => {
                      clearFilters!();
                      setSelectedDayRange({ from: null, to: null });
                      setLoading(true) && getPostsEnvelope(DFAULT_PAGE_SIZE, 0);
                    }}
                    size="small"
                    style={{ width: 90 }}
                  >
                    Reset
                  </Button>
                </Space>
              </div>
            </div>
          </Fragment>
        )}

        {lang === LanguageActionTypeEnum.en && (
          <Fragment>
            <RangePicker
              value={dateRange}
              inputReadOnly={true}
              format="YYYY/MM/DD"
              onChange={(
                dates: RangeValue<Moment>,
                dateStrings: [string, string]
              ) => {
                if (dates) {
                  setDateRange([dates![0], dates![1]]);
                  setSelectedKeys([
                    dates![0]?.format('YYYY/MM/DD') as ReactText,
                    dates![1]?.format('YYYY/MM/DD') as ReactText,
                  ]);
                }
              }}
            />

            <div>
              <div style={{ marginTop: '10px' }}>
                <Space>
                  <Button
                    type="primary"
                    onClick={() => handleSearchDateRange(confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90 }}
                  >
                    Search
                  </Button>
                  <Button
                    onClick={() => handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                  >
                    Reset
                  </Button>
                </Space>
              </div>
            </div>
          </Fragment>
        )}
      </div>
    ),
    filterIcon: (filtered) => (
      <CalendarFilled style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
  });

  const handleSearchDateRange = (
    confirm: () => void,
    dataIndex: string | number | React.ReactText[] | undefined
  ) => {
    confirm();
    setSearchedColumn(dataIndex);
  };

  let searchInput: Input;
  // Custom filter functionality implementation
  const getColumnSearchPropsForSearchFilter = (
    dataIndex: string
  ): ColumnType<any> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node!;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text: React.ReactText) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText.toString()]}
          autoEscape
          textToHighlight={
            text ? text.toString().replace(new RegExp(',+$'), '') : ''
          }
        />
      ) : (
        text
      ),
  });

  const handleSearch = (
    selectedKeys: React.ReactText[],
    confirm: () => void,
    dataIndex: string | number | React.ReactText[] | undefined
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: (() => void) | undefined) => {
    clearFilters!();
    setSearchText('');
    setDateRange([null, null]);
    setLoading(true) && getPostsEnvelope(DFAULT_PAGE_SIZE, 0);
  };

  const columns: ColumnsType<IPostAntdTable> = [
    {
      title: <Trans>{t('post-list.table.thead.title')}</Trans>,
      width: 200,
      dataIndex: TITLE,
      fixed: windowWidth > 576 ? 'left' : undefined,
      ellipsis: true,
      sorter: true,
      ...getColumnSearchPropsForSearchFilter(TITLE),
    },
    {
      title: <Trans>{t('post-list.table.thead.category')}</Trans>,
      width: 200,
      dataIndex: CATEGORY,
      ellipsis: true,
      sorter: true,
      ...getColumnSearchPropsForSearchFilter(CATEGORY),
    },
    {
      title: <Trans>{t('post-list.table.thead.status')}</Trans>,
      width: 100,
      dataIndex: STATUS,
      align: 'center',
      sorter: true,
      filterMultiple: false,
      filters: [
        {
          text: 'Publish',
          value: PostStatusEnum.Publish,
        },
        {
          text: 'Pending',
          value: PostStatusEnum.Pending,
        },
        {
          text: 'Draft',
          value: PostStatusEnum.Draft,
        },
        {
          text: 'Auto Draft',
          value: PostStatusEnum.AutoDraft,
        },
        {
          text: 'Future',
          value: PostStatusEnum.Future,
        },
        {
          text: 'Inherit',
          value: PostStatusEnum.Inherit,
        },
        {
          text: 'Private',
          value: PostStatusEnum.Private,
        },
        {
          text: 'Trash',
          value: PostStatusEnum.Trash,
        },
      ],
    },
    {
      title: <Trans>{t('post-list.table.thead.attachments')}</Trans>,
      width: 130,
      dataIndex: ATTACHMENTS,
      align: 'center',
      sorter: true,
      ...getColumnSearchPropsForSliderFilter(
        ATTACHMENTS,
        postsState.postsEnvelope.maxAttachmentsNumber
      ),
    },
    {
      title: <Trans>{t('post-list.table.thead.comment-allowed')}</Trans>,
      width: 200,
      dataIndex: COMMENT_ALLOWED,
      align: 'center',
      sorter: true,
      filterMultiple: false,
      filters: [
        {
          text: 'Allowed',
          value: true,
        },
        {
          text: 'Not Allowed',
          value: false,
        },
      ],
    },
    {
      title: <Trans>{t('post-list.table.thead.view-count')}</Trans>,
      width: 200,
      dataIndex: VIEW_COUNT,
      align: 'center',
      sorter: true,
      ...getColumnSearchPropsForSliderFilter(
        VIEW_COUNT,
        postsState.postsEnvelope.maxViewCount
      ),
    },
    {
      title: <Trans>{t('post-list.table.thead.pinned')}</Trans>,
      width: 100,
      dataIndex: PINNED,
      align: 'center',
      sorter: true,
      filterMultiple: false,
      filters: [
        {
          text: 'Pinned',
          value: true,
        },
        {
          text: 'Not Pinned',
          value: false,
        },
      ],
    },
    {
      title: <Trans>{t('post-list.table.thead.histories')}</Trans>,
      width: 100,
      dataIndex: HISTORIES,
      align: 'center',
      sorter: true,
      ...getColumnSearchPropsForSliderFilter(
        HISTORIES,
        postsState.postsEnvelope.maxPostHistories
      ),
    },
    {
      title: <Trans>{t('post-list.table.thead.comments')}</Trans>,
      width: 120,
      dataIndex: COMMENTS,
      align: 'center',
      sorter: true,
      ...getColumnSearchPropsForSliderFilter(
        COMMENTS,
        postsState.postsEnvelope.maxComments
      ),
    },
    {
      title: <Trans>{t('post-list.table.thead.child-posts')}</Trans>,
      width: 150,
      dataIndex: CHILD_POSTS,
      align: 'center',
      sorter: true,
      ...getColumnSearchPropsForSliderFilter(
        CHILD_POSTS,
        postsState.postsEnvelope.maxChildPosts
      ),
    },
    {
      title: <Trans>{t('post-list.table.thead.created-at')}</Trans>,
      width: 200,
      dataIndex: CREATED_AT,
      align: 'center',
      sorter: true,
      ...getColumnSearchPropsForDateRangeFilter(CREATED_AT),
    },
    {
      title: <Trans>{t('post-list.table.thead.created-by')}</Trans>,
      width: 150,
      dataIndex: CREATED_BY,
      sorter: true,
      ...getColumnSearchPropsForSearchFilter(CREATED_BY),
    },
    {
      title: <Trans>{t('post-list.table.thead.modified-at')}</Trans>,
      width: 150,
      dataIndex: MODIFIED_AT,
      align: 'center',
      sorter: true,
      ...getColumnSearchPropsForDateRangeFilter(MODIFIED_AT),
    },
    {
      title: <Trans>{t('post-list.table.thead.modified-by')}</Trans>,
      width: 150,
      dataIndex: MODIFIED_BY,
      sorter: true,
      ...getColumnSearchPropsForSearchFilter(MODIFIED_BY),
    },
    {
      title: <Trans>{t('post-list.table.thead.user-agent')}</Trans>,

      dataIndex: USER_AGENT,
      ellipsis: true,
      children: [
        {
          title: 'Device',
          dataIndex: USER_AGENT_DEVICE,
          align: 'center',
          width: 100,
          filterMultiple: false,
          filters: [
            {
              text: 'Desktop',
              value: 'desktop',
            },
            {
              text: 'Tablet',
              value: 'tablet',
            },
            {
              text: 'Mobile',
              value: 'mobile',
            },
          ],
        },
        {
          title: 'OS',
          dataIndex: USER_AGENT_OS,
          align: 'center',
          width: 150,
          filterMultiple: false,
          filters: [
            {
              text: 'macOS',
              value: 'macOS',
            },
            {
              text: 'Windows',
              value: 'windows',
            },
            {
              text: 'Linux',
              value: 'linux',
            },
            {
              text: 'iPadOS',
              value: 'iPadOS',
            },
            {
              text: 'iPhoneOS',
              value: 'iPhoneOS',
            },
            {
              text: 'Android',
              value: 'android',
            },
          ],
        },
        {
          title: 'Browser',
          dataIndex: USER_AGENT_BROWSER,
          align: 'center',
          width: 170,
          filterMultiple: false,
          filters: [
            {
              text: 'Chrome',
              value: 'chrome',
            },
            {
              text: 'Safari',
              value: 'safari',
            },
            {
              text: 'Firefox',
              value: 'firefox',
            },
            {
              text: 'Edge',
              value: 'edge',
            },
            {
              text: 'Internet Explorer',
              value: 'IE',
            },
            {
              text: 'Opera',
              value: 'opera',
            },
          ],
        },
      ],
    },
    {
      title: <Trans>{t('post-list.table.thead.ip-address')}</Trans>,
      width: 150,
      dataIndex: IP_ADDRESS,
      sorter: true,
      ...getColumnSearchPropsForSearchFilter(IP_ADDRESS),
    },
    {
      title: <Trans>{t('post-list.table.thead.actions')}</Trans>,
      key: ACTIONS,
      fixed: windowWidth > 576 ? 'right' : undefined,
      width: 150,
      align: 'center',
      render: () => (
        <Space>
          <Tooltip
            title={<Trans>{t('post-list.table.tooltip.edit-post')}</Trans>}
            color="gray"
          >
            <Button
              type="link"
              size="middle"
              icon={<EditFilled />}
              className="text warning-color"
            />
          </Tooltip>
          <Tooltip
            title={<Trans>{t('post-list.table.tooltip.delete-post')}</Trans>}
            color="gray"
          >
            <Button type="link" size="middle" icon={<DeleteFilled />} danger />
          </Tooltip>
          <Tooltip
            title={<Trans>{t('post-list.table.tooltip.post-history')}</Trans>}
            color="gray"
          >
            <Button type="link" size="middle" icon={<ClockCircleFilled />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  let data: IPostAntdTable[] = [];

  useEffect(() => {
    getPostsEnvelope(DFAULT_PAGE_SIZE, 0);

    window.addEventListener('resize', (event) => {
      setWindowWidth(window.innerWidth);
    });
  }, [getPostsEnvelope]);

  postsState.postsEnvelope.posts.forEach((post, i) => {
    const ua = new UAParser();
    ua.setUA(post.userAgent);

    data.push({
      key: i,
      title: lang === LanguageActionTypeEnum.fa
      ? e2p(post.title)
      : post.title,
      postCategory: post.taxonomyPosts.map((taxonomyPost: ITaxonomyPost) =>
        taxonomyPost.taxonomy.type === TaxonomyTypeEnum.category
          ? `${ lang === LanguageActionTypeEnum.fa ? e2p(taxonomyPost.taxonomy.term.name) : taxonomyPost.taxonomy.term.name} \n`
          : ''
      ),
      postStatus: post.postStatus,
      postAttachments: lang === LanguageActionTypeEnum.fa
        ? e2p(post.postAttachments.length.toString())
        : post.postAttachments.length,
      commentAllowed: post.commentAllowed ? (
        <CheckOutlined style={{ color: '#52c41a' }} />
      ) : (
        <CloseOutlined style={{ color: '#f5222d' }} />
      ),
      viewCount: lang === LanguageActionTypeEnum.fa
        ? e2p(post.viewCount.toString())
        : post.viewCount,
      pinned: post.isPinned ? (
        <CheckOutlined style={{ color: '#52c41a' }} />
      ) : (
        <CloseOutlined style={{ color: '#f5222d' }} />
      ),
      postHistories:
        lang === LanguageActionTypeEnum.fa
          ? e2p(post.postHistories.toString())
          : post.postHistories,
      comments: lang === LanguageActionTypeEnum.fa ? e2p(post.comments.toString()) : post.comments,
      childPosts: lang === LanguageActionTypeEnum.fa
        ? e2p(post.childPosts.toString())
        : post.childPosts,
      createdAt:
        lang === LanguageActionTypeEnum.fa
          ? e2p(
              jalaliMoment(post.createdAt, 'YYYY-MM-DD HH:m:s')
                .locale('fa')
                .format('YYYY-MM-DD HH:m:s')
            )
          : moment(post.createdAt).format('YYYY-MM-DD HH:m:s'),
      createdBy: post.createdBy?.userName,
      modifiedAt: post.modifiedAt
        ? lang === LanguageActionTypeEnum.fa
          ? e2p(
              jalaliMoment(post.modifiedAt, 'YYYY-MM-DD HH:m:s')
                .locale('fa')
                .format('YYYY-MM-DD HH:m:s')
            )
          : moment(post.modifiedAt).format('YYYY-MM-DD HH:m:s')
        : '',
      modifiedBy: post.modifiedBy?.userName,
      //userAgent: post.userAgent,
      device: ua.getDevice().type ?? 'Desktop',
      os: lang === LanguageActionTypeEnum.fa ? `${ua.getOS().name} ${e2p(ua.getOS().version)}` : `${ua.getOS().name} ${ua.getOS().version}`,
      browser: lang === LanguageActionTypeEnum.fa ? `${ua.getBrowser().name} ${e2p(ua.getBrowser().version?.toString())}` : `${ua.getBrowser().name} ${ua.getBrowser().version}`,
      userIPAddress: lang === LanguageActionTypeEnum.fa ? e2p(post.userIPAddress) : post.userIPAddress,
    });
  });

  function confirm(e: MouseEvent | undefined): void {
    console.log(e);
    message.success('Click on Yes');
  }

  function cancel(e: MouseEvent | undefined): void {
    console.log(e);
    message.error('Click on No');
  }

  return (
    <Fragment>
      <Row align="bottom">
        <Col span={12}>
          <Typography>
            <Title level={4}>
              <Trans>{t('post-list.title')}</Trans>
            </Title>
            <Paragraph ellipsis>
              <Text type="secondary">
                <Trans>{t('post-list.text')}</Trans>
              </Text>
            </Paragraph>
          </Typography>
        </Col>
        <Col
          span={12}
          style={{
            textAlign: dir === DirectionActionTypeEnum.LTR ? 'right' : 'left',
          }}
        >
          <Popconfirm
            title={
              <Trans>{t('post-list.button.delete.popConfirm.title')}</Trans>
            }
            onConfirm={confirm}
            onCancel={cancel}
            okText={
              <Trans>{t('post-list.button.delete.popConfirm.okText')}</Trans>
            }
            cancelText={
              <Trans>
                {t('post-list.button.delete.popConfirm.cancelText')}
              </Trans>
            }
            placement={lang === LanguageActionTypeEnum.en ? 'left' : 'right'}
            okButtonProps={{ danger: true }}
          >
            <Button
              type="primary"
              danger
              icon={<DeleteFilled />}
              size="small"
              style={{ marginBottom: '1rem' }}
            >
              <Trans>{t('post-list.button.delete.name')}</Trans>
            </Button>
          </Popconfirm>
        </Col>
      </Row>
      <Row>
        <Table<IPostAntdTable>
          loading={postsState.loadingInitial}
          bordered
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          size="small"
          scroll={{ x: window.innerWidth - 100, y: window.innerHeight - 100 }}
          pagination={{
            size: 'small',
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            total: postsState.postsEnvelope.postCount,
            responsive: true,
          }}
          onChange={(pagination, filters, sorter) => {
            const sort = sorter as SorterResult<IPostAntdTable>;
            let filterKey;
            let filterValue;
            let startDate;
            let endDate;
            let startNumber;
            let endNumber;
            for (const [key, value] of Object.entries(filters)) {
              if (value && SEARCH_FILTERED_COLUMNS.includes(key)) {
                filterKey = key;
                filterValue = value[0];
              }
              if (value && DATERANGE_FILTERED_COLUMNS.includes(key)) {
                filterKey = key;
                startDate = value![0];
                endDate = value![1];
              }
              if (value && SLIDER_FILTERED_COLUMNS.includes(key)) {
                filterKey = key;
                startNumber = value[0];
                endNumber = value[1];
              }
            }
            setLoading(true) &&
              getPostsEnvelope(
                pagination.pageSize,
                pagination.current ? pagination.current! - 1 : undefined,
                filterKey,
                filterValue,
                sort.field,
                sort.order,
                startDate,
                endDate,
                startNumber,
                endNumber
              );
          }}
        />
      </Row>
    </Fragment>
  );
};

const mapStateToProps = ({
  postsState,
  localeState,
}: IStoreState): {
  postsState: IPostState;
  lang: LanguageActionTypeEnum;
  dir: DirectionActionTypeEnum;
} => {
  const { lang, dir } = localeState;
  return { postsState, lang, dir };
};

export default withTranslation()(
  connect(mapStateToProps, { getPostsEnvelope, setLoading })(PostList)
);