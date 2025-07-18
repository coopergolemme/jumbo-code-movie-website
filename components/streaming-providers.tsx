"use client";

import { getProviderLogo } from "@/lib/utils";
import { useState, useEffect } from "react";
import { getAllWatchProviders, Provider } from "@/lib/movie-api";
import {
  Button,
  Center,
  Group,
  MantineProvider,
  Modal,
  MultiSelect,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  getCurrentUser,
  getUserStreamingProviders,
  updateUserStreamingProviders,
} from "@/lib/user-api";
import { Loader } from "@mantine/core";

export default function StreamingProviders() {
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [user, setUser] = useState<any>(null);
  const [allProviders, setAllProviders] = useState<Provider[]>([]);
  const [userStreamingProviders, setUserStreamingProviders] = useState<
    string[]
  >([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

  useEffect(() => {
    const initializeUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);

        const providers = await getUserStreamingProviders(currentUser.id);
        setUserStreamingProviders(providers);
        setSelectedProviders(providers);
        setUserLoading(false);
      }
    };

    initializeUser();
  }, []);

  useEffect(() => {
    const fetchAllProviders = async () => {
      const allProviders = await getAllWatchProviders();
      if (allProviders) {
        setAllProviders(allProviders);
      }
    };
    fetchAllProviders();
  }, []);

  const saveProvidersToDatabase = async (providers: string[]) => {
    if (!user) return false;

    const success = await updateUserStreamingProviders(user.id, providers);
    if (success) {
      setUserStreamingProviders(providers);
      return true;
    }
    return false;
  };

  const handleProviderToggle = async (providerName: string) => {
    const isSelected = selectedProviders.includes(providerName);
    const updatedProviders = isSelected
      ? selectedProviders.filter((p) => p !== providerName)
      : [...selectedProviders, providerName];

    setSelectedProviders(updatedProviders);
    await saveProvidersToDatabase(updatedProviders);
  };

  const renderOption = ({ option }) => {
    return (
      <Group gap="sm">
        <img
          src={option.image}
          alt={option.label}
          style={{ width: 24, height: 24 }}
        />
        <span>{option.label}</span>
      </Group>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Streaming Providers</h1>
        <Button
          onClick={open}
          variant="filled"
          size="sm">
          Manage Providers
        </Button>
      </div>

      {/* Display current providers */}
      <Group>
        {userLoading ? (
          <Loader type="dots" />
        ) : userStreamingProviders.length > 0 ? (
          userStreamingProviders.map((providerName: string, index: number) => {
            const provider = allProviders.find(
              (p) => p.provider_name === providerName
            );
            return provider ? (
              <div
                key={index}
                className="flex items-center space-x-2 p-2 border rounded-lg">
                <img
                  src={getProviderLogo(provider.logo_path)}
                  alt={provider.provider_name}
                  className="h-8 w-8"
                />
                <span>{provider.provider_name}</span>
              </div>
            ) : null;
          })
        ) : (
          <p className="text-gray-500">No streaming providers selected.</p>
        )}
      </Group>
      {/* Modal with MultiSelect */}
      <Modal
        opened={opened}
        onClose={close}
        title="Select Streaming Providers">
        <MultiSelect
          data={allProviders.map((provider) => ({
            value: provider.provider_name,
            label: provider.provider_name,
            image: getProviderLogo(provider.logo_path),
          }))}
          value={selectedProviders}
          onChange={setSelectedProviders}
          hidePickedOptions
          searchable
          placeholder="Search and select providers..."
          renderOption={renderOption}
        />
        <Button
          onClick={async () => {
            await saveProvidersToDatabase(selectedProviders);
            close();
          }}
          className="mt-4">
          Save Changes
        </Button>
      </Modal>
    </>
  );
}
