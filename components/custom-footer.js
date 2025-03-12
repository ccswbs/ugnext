import { Container } from "@/components/container";
import { getCustomFooter} from "@/data/drupal/basic-pages";

export const CustomFooter = ({custfoot}) => {

const units = custfoot;

const tags = units.map((tag) => tag.path.replace("/taxonomy/term/", ""));

console.log("tags",tags)
  const customFooter =  getCustomFooter(tags);
return (

    <div className="bg-gray-50">
        <Container className="" centered={true}>
            This is it

        </Container>
    </div>

);

};