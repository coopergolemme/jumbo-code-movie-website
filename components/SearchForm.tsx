import { useForm } from "@mantine/form";
import SearchInput from "./SearchInput";
import { ActionIcon, useMantineTheme } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";

export default function SearchForm() {
  const theme = useMantineTheme();

  const form = useForm({
    initialValues: {
      search: "",
    },
    validate: {
      search: (value) =>
        value.length === 0 ? "Enter a movie to search" : null,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log("Form has been submitted", values);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <SearchInput
        placeholder="Search for movie"
        {...form.getInputProps("search")}
        rightSection={
          <ActionIcon
            size={32}
            radius="xl"
            color={theme.primaryColor}
            variant="filled"
            type="submit">
            <IconArrowRight
              size={18}
              stroke={1.5}
            />
          </ActionIcon>
        }
      />
    </form>
  );
}
