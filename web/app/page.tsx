import Principal from '@/modules/auth/templates/principal';
import {getUserInfoByTokenService} from '@/modules/dashboard/services';

export const metadata = {
  title: 'Principal',
};

export default async function Page() {
  const clientInfo = (await getUserInfoByTokenService()).data;

  return <Principal clientInfo={clientInfo} />;
}
