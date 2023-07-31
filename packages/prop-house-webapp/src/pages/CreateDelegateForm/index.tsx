import classes from './CreateDelegateForm.module.css';
import { Col, Container, Row } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import { PropHouseWrapper } from '@nouns/prop-house-wrapper';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useSigner } from 'wagmi';
import { nameToSlug } from '../../utils/communitySlugs';
import { TimedAuction } from '@nouns/prop-house-wrapper/dist/builders';
import { Link, useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { setAlert, clearClick, alertSlice } from '../../state/slices/alert';
import { useDispatch, useSelector } from 'react-redux';

const CreateDelegateForm: React.FC<{}> = () => {
  const host = useAppSelector(state => state.configuration.backendHost);
  const client = useRef(new PropHouseWrapper(host));
  const { data: signer } = useSigner();
  useEffect(() => {
    client.current = new PropHouseWrapper(host, signer);
  }, [signer, host]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const timeWarningMessage = 'Time set should not be earlier than present time!';
  const orderWarningMessage = 'Time set did not follow the required order!';
  const blankWarningMessage = 'Input bar should not be blank!';

  const MAX_TITLE_LENGTH = 50;
  const MAX_DESCRIPTION_LENGTH = 300;
  const [titleLength, setTitleLength] = useState(0);
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [showError, setShowError] = useState(false);
  const currentDate = useRef(new Date());
  const currentTime = dayjs();
  // 初始化表单中的时间字段为当前时间
  const [roundStartTime, setRoundStartTime] = useState<Dayjs | null>(currentTime);
  const [grantStartTime, setGrantStartTime] = useState<Dayjs | null>(currentTime);
  const [grantEndTime, setGrantEndTime] = useState<Dayjs | null>(currentTime);
  const [roundEndTime, setRoundEndTime] = useState<Dayjs | null>(currentTime);
  const [showOrderWarning, setShowOrderWarning] = useState(false);
  const [showBlankWarning, setShowBlankWarning] = useState(false);

  const [isStartTimeFilled, setIsStartTimeFilled] = useState(false);
  const [isProposalTimeFilled, setIsProposalTimeFilled] = useState(false);
  const [isVotingTimeFilled, setIsVotingTimeFilled] = useState(false);
  const [isEndTimeFilled, setIsEndTimeFilled] = useState(false);

  const alertType = useSelector(state => state.alert.type);
  const alertMessage = useSelector(state => state.alert.message);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const [state, setState] = useState({
    description: '',
    title: '',
    startTime: new Date(''),
    endTime: new Date(''),
    proposalEndTime: new Date(''),
    votingEndTime: new Date(''),
  });

  const saveFormTitle = (value: string) => {
    const limitedTitle = value.slice(0, MAX_TITLE_LENGTH);
    setState(prevState => ({ ...prevState, title: limitedTitle }));
    setTitleLength(limitedTitle.length); // Update the titleLength state with the current input length
  };

  const saveFormDesc = (value: string) => {
    const limitedDescription = value.slice(0, MAX_DESCRIPTION_LENGTH);
    setState(prevState => ({ ...prevState, description: limitedDescription }));
    setDescriptionLength(limitedDescription.length); // Update the descriptionLength state with the current input length
  };

  const saveFormStart = (value: Dayjs | null) => {
    if (value !== null) {
      setState(prevState => ({
        ...prevState,
        startTime: value.toDate(),
      }));
      setRoundStartTime(value);
      setIsStartTimeFilled(true);
    }
  };

  const saveFormProposal = (value: Dayjs | null) => {
    if (value !== null) {
      setState(prevState => ({
        ...prevState,
        startTime: value.toDate(),
      }));
      setGrantStartTime(value);
      setIsProposalTimeFilled(true);
    }
  };

  const saveFormVote = (value: Dayjs | null) => {
    if (value !== null) {
      setState(prevState => ({
        ...prevState,
        startTime: value.toDate(),
      }));
      setGrantEndTime(value);
      setIsVotingTimeFilled(true);
    }
  };

  const saveFormEnd = (value: Dayjs | null) => {
    if (value !== null) {
      setState(prevState => ({
        ...prevState,
        startTime: value.toDate(),
      }));
      setRoundEndTime(value);
      setIsEndTimeFilled(true);
    }
  };
  const hideAlert = () => {
    setIsAlertVisible(false); // 隐藏警告
  };

  const handleSubmit = async (e: any) => {
    //该方法阻止表单的提交
    e.preventDefault();

    if (
      !state.description.trim() ||
      !state.title.trim() ||
      !state.startTime ||
      !state.proposalEndTime ||
      !state.votingEndTime ||
      !state.endTime
    ) {
      //setShowOrderWarning(true);
      //dispatch(setAlert({ type: 'error', message: blankWarningMessage }));
      //setShowOrderWarning(false);
      setIsAlertVisible(true);
      return;
    }

    const currentTime = dayjs();
    if (
      state.startTime < currentDate.current ||
      state.proposalEndTime < currentDate.current ||
      state.votingEndTime < currentDate.current ||
      state.endTime < currentDate.current
    ) {
      //dispatch(setAlert({ type: 'error', message: timeWarningMessage }));
      //setShowBlankWarning(false);
      setIsAlertVisible(true);
      return;
    }
    // 检查是否有时间比上一个时间要早的情况
    if (grantStartTime && grantStartTime.isBefore(roundStartTime)) {
      dispatch(setAlert({ type: 'error', message: orderWarningMessage }));
      setShowBlankWarning(false);

      return;
    }

    if (grantEndTime && grantEndTime.isBefore(grantStartTime)) {
      dispatch(setAlert({ type: 'error', message: orderWarningMessage }));
      setShowBlankWarning(false);
      return;
    }

    if (roundEndTime && roundEndTime.isBefore(grantEndTime)) {
      dispatch(setAlert({ type: 'error', message: orderWarningMessage }));
      setShowBlankWarning(false);
      return;
    }
    dispatch(clearClick());
  };

  useEffect(() => {
    // 在isAlertVisible为true时，设定定时器
    if (isAlertVisible) {
      const timer = setTimeout(() => {
        setIsAlertVisible(false); // 定时器到期后，隐藏警告
      }, 5000); // 设定定时器时间，这里是5秒，可以根据需要调整
      return () => clearTimeout(timer); // 组件卸载时，清除定时器
    }
  }, [isAlertVisible]);

  return (
    <div className={classes.blackBg}>
      <Container>
        <Row>
          <form onSubmit={handleSubmit}>
            <div className={classes.title}>Delegation Round Creation</div>
            <div className={classes.desc}>
              Use this form to create a new delegation round. Please visit our Discord if you have
              any questions:{' '}
              <a href="https://discord.gg/uQnjZhZPfu" target="_blank" className={classes.alink}>
                https://discord.gg/uQnjZhZPfu
              </a>
              .
            </div>

            <div className={classes.labelMargin}>
              <div className={classes.desc}>
                What is the delegation round name? (Please use only standard letters, no special
                characters such as dashes or question marks)*
                <span className={classes.characterCount}>
                  {titleLength}/{MAX_TITLE_LENGTH}
                </span>
              </div>

              <input
                onChange={event => saveFormTitle(event.target.value)}
                name={'title'}
                value={state.title}
                className={classes.input}
                type="text"
              />
            </div>

            <div className={classes.labelMargin}>
              <div className={classes.desc}>
                What is the description of this round of delegation? (Please use a markdown editor
                to format your description) *
                <span className={classes.characterCount1}>
                  {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
                </span>
              </div>

              <textarea
                rows={4}
                onChange={event => saveFormDesc(event.target.value)}
                value={state.description}
                name={'description'}
                className={classes.input}
              />
            </div>
            <div className={classes.flexDiv}>
              <div className={classes.dateMain}>
                <div className={classes.labelMargin}>
                  <div className={classes.desc}>
                    When does the delegation round start accepting applications? (exact date and
                    time in UTC)*
                  </div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                      <DateTimePicker
                        onChange={newValue => saveFormStart(newValue)}
                        className={classes.input}
                        minDate={dayjs()}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>

                <div className={classes.labelMargin}>
                  <div className={classes.desc}>
                    When can community members start granting voting power to delegate applicants?
                    (exact date and time in UTC)*
                  </div>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                      <DateTimePicker
                        onChange={newValue => saveFormProposal(newValue)}
                        className={classes.input}
                        minDate={dayjs()}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>

                <div className={classes.labelMargin}>
                  <div className={classes.desc}>
                    When is the last day community members can grant voting power to delegate
                    applicants? (exact date and time in UTC)*
                  </div>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                      <DateTimePicker
                        onChange={newValue => saveFormVote(newValue)}
                        className={classes.input}
                        minDate={dayjs()}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
                <div className={classes.labelMargin}>
                  <div className={classes.desc}>
                    When does the delegation round end? (exact date and time in UTC)*
                  </div>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                      <DateTimePicker
                        onChange={newValue => saveFormEnd(newValue)}
                        className={classes.input}
                        minDate={dayjs()}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
              </div>
              <div className={classes.paddingTop}>
                <div className={classes.xian + ' ' + classes.xian1}></div>
                <div className={classes.flexDiv}>
                  <div
                    className={classes.qiu}
                    style={{
                      background: isStartTimeFilled
                        ? 'var(--qiu-color-filled)'
                        : 'var(--qiu-color-default)',
                    }}
                  ></div>
                  <div className={`${classes.qiuDesc} ${isStartTimeFilled ? classes.filled : ''}`}>
                    Time to start accepting applicants
                  </div>
                </div>

                <div className={classes.xian + ' ' + classes.xian2}></div>
                <div className={classes.flexDiv}>
                  <div
                    className={classes.qiu}
                    style={{
                      background: isProposalTimeFilled
                        ? 'var(--qiu-color-filled)'
                        : 'var(--qiu-color-default)',
                    }}
                  ></div>
                  <div
                    className={`${classes.qiuDesc} ${isProposalTimeFilled ? classes.filled : ''}`}
                  >
                    Time to select delegates
                  </div>
                </div>
                <div className={classes.xian + ' ' + classes.xian3}></div>
                <div className={classes.flexDiv}>
                  <div
                    className={classes.qiu}
                    style={{
                      background: isVotingTimeFilled
                        ? 'var(--qiu-color-filled)'
                        : 'var(--qiu-color-default)',
                    }}
                  ></div>
                  <div className={`${classes.qiuDesc} ${isVotingTimeFilled ? classes.filled : ''}`}>
                    Time to end selection period
                  </div>
                </div>
                <div className={classes.xian + ' ' + classes.xian4}></div>
                <div className={classes.flexDiv}>
                  <div
                    className={classes.qiu}
                    style={{
                      background: isEndTimeFilled
                        ? 'var(--qiu-color-filled)'
                        : 'var(--qiu-color-default)',
                    }}
                  ></div>
                  <div className={`${classes.qiuDesc} ${isEndTimeFilled ? classes.filled : ''}`}>
                    Delegation End Time
                  </div>
                </div>
                <div className={classes.xian + ' ' + classes.xian5}></div>
              </div>
            </div>
            <button className={classes.button}>Submit</button>
            {isAlertVisible && (
              <div className={classes.popup} onClick={hideAlert}>
                {/* Display the alert content here */}
                <div className={classes.popupContent}>
                  {/* Use the alertType and alertMessage variables to show the appropriate content */}
                  {alertType === 'error' && <span className={classes.error}>{alertMessage}</span>}
                  {alertType === 'warning' && (
                    <span className={classes.warning}>{alertMessage}</span>
                  )}
                  {alertType === 'info' && <span className={classes.info}>{alertMessage}</span>}
                  {alertType === 'success' && (
                    <span className={classes.success}>{alertMessage}</span>
                  )}
                </div>
              </div>
            )}
          </form>
        </Row>
      </Container>
    </div>
  );
};

export default CreateDelegateForm;
