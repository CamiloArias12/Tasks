import {SignOut} from '@/modules/auth/components/sign-out';
import {getUserInfoByTokenService as getUserInfoByTokenService} from '@/modules/dashboard/services';
import {SideBar} from '@/modules/dashboard/templates/sidebar';
import {TopBar} from '@/modules/dashboard/templates/topbar';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clientInfo = (await getUserInfoByTokenService()).data;

  if (!clientInfo) {
    return <SignOut />;
  }

  return (
    <section className="flex flex-row h-screen w-screen overflow-hidden">
      <SideBar clientInfo={clientInfo} />
      <div className="flex h-full w-full flex-col bg-gray-100 gap-8 md:gap-0">
        <TopBar clientInfo={clientInfo} />
        <div className="w-full max-w-full h-full rounded-md overflow-hidden">{children}</div>
      </div>
    </section>
  );
}
