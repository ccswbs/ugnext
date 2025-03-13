import { Container } from "@/components/container";


export const CustomFooter = ({custfoot}) => {

    console.log (custfoot.customFooterByTag.results)

    return (
    <>
            {custfoot?.customFooterByTag.results.map((customFoot) => (
                customFoot.id 
        // <HtmlPaser html={customFoot.body.processed}/＞
            ))}



        <Container className="">

    <div className="bg-gray-50">
            This is it
    </div>
        </Container>

    </>
);

};