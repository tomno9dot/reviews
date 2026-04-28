import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserReferralCode, getReferralStats } from '@/lib/referral';
import ReferralClient from '@/components/referral/ReferralClient';

export default async function ReferralsPage() {
  const session = await getServerSession(authOptions);
  
  const [referralCode, stats] = await Promise.all([
    getUserReferralCode(session.user.id),
    getReferralStats(session.user.id)
  ]);

  const referralLink = `${process.env.NEXT_PUBLIC_APP_URL}/register?ref=${referralCode}`;

  return (
    <div className="p-6 max-w-4xl">
      <div className="page-header">
        <h1 className="page-title">🎁 Referral Program</h1>
        <p className="page-subtitle">
          Earn 1 free month for every person you refer who upgrades
        </p>
      </div>

      <ReferralClient 
        referralLink={referralLink}
        referralCode={referralCode}
        stats={stats}
      />
    </div>
  );
}