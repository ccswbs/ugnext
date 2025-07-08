import { Header } from "@/components/server/header";
import { Layout, LayoutContent } from "@uoguelph/react-components/layout";
import { Footer } from "@uoguelph/react-components/footer";
import { OVCFooter } from "@/components/client/ovc/ovc-footer";

export default async function OVCNewsHub() {
  return (
    <Layout>
      <Header name="OVC_MAIN"></Header>

      <LayoutContent container={false}></LayoutContent>

      <OVCFooter />
      <Footer></Footer>
    </Layout>
  );
}
