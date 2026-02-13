import { NewsSearchFragment } from "@/lib/graphql/types";
import { NewsSearch as NewsSearchComponent } from "@/components/client/news/news-search";

export function NewsSearch({ data }: { data: NewsSearchFragment }) {
  return <NewsSearchComponent></NewsSearchComponent>;
}
