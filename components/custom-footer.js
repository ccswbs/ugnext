import { Container } from "@/components/container";
import { HtmlParser } from "@/components/html-parser";

export const CustomFooter = ({custfoot}) => {

    console.log (custfoot.customFooterByTag.results)

    return (
    <div>
            {custfoot?.customFooterByTag.results.map((customFoot) => 
                customFoot.id 
        // <HtmlPaser html={customFoot.body.processed}/＞
            )}



        <Container className="">

    <div className="bg-gray-50">

            <HtmlParser html={custfoot.customFooterByTag.results[1].body.processed} />
    </div>
        </Container>

    </div>
);

};