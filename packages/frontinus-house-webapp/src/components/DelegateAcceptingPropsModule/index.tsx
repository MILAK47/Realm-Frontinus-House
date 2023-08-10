import classes from './DelegateAcceptingPropsModule.module.css';
import { Community, StoredAuctionBase } from '@nouns/frontinus-house-wrapper/dist/builders';
import { AuctionStatus, auctionStatus } from '../../utils/auctionStatus';
import { useDispatch } from 'react-redux';
import { clearProposal } from '../../state/slices/editor';
import Button, { ButtonColor } from '../Button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RoundModuleCard from '../RoundModuleCard';
import { isInfAuction } from '../../utils/auctionType';
import dayjs from 'dayjs';
import ConnectButton from '../ConnectButton';
import {useAccount, useWalletClient} from 'wagmi';
import { useAppSelector } from '../../hooks';
import {useEffect, useRef, useState} from "react";
import { ApiWrapper } from '@nouns/frontinus-house-wrapper';
import delegate from "../../state/slices/delegate";

const DelegateAcceptingPropsModule: React.FC<{
  auction: StoredAuctionBase;
  community: Community;
}> = props => {
  const { auction, community } = props;

  const proposals = useAppSelector(state => state.delegate.activeProposals);
  const isProposingWindow = auctionStatus(auction) === AuctionStatus.AuctionAcceptingProps;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { address: account } = useAccount();
  const { t } = useTranslation();
  const { data: walletClient } = useWalletClient();
  const backendHost = useAppSelector(state => state.configuration.backendHost);
  const backendClient = useRef(new ApiWrapper(backendHost, walletClient));

  const [delegateStatus, setDelegateStatus] = useState(false);

  useEffect(() => {
      backendClient.current = new ApiWrapper(backendHost, walletClient);
  }, [walletClient, backendHost]);

  useEffect(() => {
      // auction.id
      setDelegateStatus(false);
      if(account && auction){
          fetchDelegateStatus();
      }

  }, [account, auction]);

  const fetchDelegateStatus = async () => {
      const raw = await backendClient.current.getDelegationApplied(auction.id);
      setDelegateStatus(raw);
  };

    const content = (
        <>
            <b>{t('howBecomeDelegate')}:</b>
            <div className={classes.bulletList}>
                <div className={classes.bulletItem}>
                    <hr className={classes.bullet} />
                    <div className={classes.customParagraph}>
                        <p>{t('delegateDesc')}</p>
                    </div>
                </div>

            </div>

            {isProposingWindow &&
            (account ? (

                (delegateStatus ? <Button
                    text={'Already Submitted'}
                    bgColor={ButtonColor.Gray}
                /> :
                    <Button
                        classNames={classes.margintop28}
                        text={t('becomeDelegate')}
                        bgColor={ButtonColor.Green}
                        onClick={() => {
                            dispatch(clearProposal());
                            navigate('/application/create', { state: { auction, community, proposals } });
                        }}
                    />
                )


            ) : (
                <ConnectButton classNames={classes.margintop28} color={ButtonColor.Pink} />
            ))}
        </>
    );


    return (
    <RoundModuleCard
      title={t('acceptingApplications')}
      subtitle={
        <>
          Until{' '}
          {isInfAuction(auction)
            ? 'funding is depleted'
            : dayjs(auction.proposalEndTime).format('MMMM D')}
        </>
      }
      content={content}
      type="proposing"
    />
  );
};

export default DelegateAcceptingPropsModule;
