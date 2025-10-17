import { Container } from "@uoguelph/react-components/container";
import { TextInput } from "@uoguelph/react-components/text-input";

export type ProfileSearchBarProps = {
  searchByName: boolean;
  searchByResearchArea: boolean;
  filterByUnits: boolean;
  filterByTypes: boolean;
  filterByAcceptingGraduateStudents: boolean;
  filterByCategories: boolean;
};

export function ProfileSearchBar(props: ProfileSearchBarProps) {
  const {
    searchByName,
    searchByResearchArea,
    filterByUnits,
    filterByTypes,
    filterByAcceptingGraduateStudents,
    filterByCategories,
  } = props;

  return (
    <div className="w-full bg-yellow -mt-1">
      <Container className="w-full bg-yellow flex flex-col gap-4 py-[4rem]! sm:flex-row sm:items-end">
        {searchByName && (
          <div className="flex-1">
            <TextInput
              onInput={(e) => {
                console.log(e);
              }}
            >
              <span className="text-yellow-contrast text-l font-bold mb-1">Search by first or last name</span>
            </TextInput>
          </div>
        )}

        {searchByResearchArea && (
          <div className="flex-1">
            <TextInput
              onInput={(e) => {
                console.log(e);
              }}
            >
              <span className="text-yellow-contrast text-l font-bold mb-1">Search by research area</span>
            </TextInput>
          </div>
        )}
      </Container>
    </div>
  );
}
