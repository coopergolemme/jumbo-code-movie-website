import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import {
  ActionIcon,
  TextInput,
  TextInputProps,
  useMantineTheme,
} from "@mantine/core";

export default function SearchInput(props: TextInputProps) {

  return (
    <TextInput
      radius="xl"
      size="md"
      rightSectionWidth={42}
      leftSection={
        <IconSearch
          size={18}
          stroke={1.5}
        />
      }
      
      {...props}
    />
  );
}
