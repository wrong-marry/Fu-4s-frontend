import { Button, Modal, Stack, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useEffect } from "react";
import { useFetcher } from "react-router-dom";
import { toast } from "react-toastify";

function FolderModal({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) {
  const fetcher = useFetcher();
  const { data, state } = fetcher;
  const isSubmitting = state === "submitting";

  useEffect(() => {
    if (data?.success) {
      toast.success(data?.msg);
    }
    if (!data?.success) {
      toast.error(data?.msg);
    }
    setTimeout(() => {
      close();
    }, 1000);
  }, [data]);

  const form = useForm({
    initialValues: {
      fileName: "",
      description: "",
    },
    validate: {
      fileName: isNotEmpty("File name is required"),
    },
  });
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        size="xl"
        title="Upload a file"
      >
        <fetcher.Form
          onSubmit={form.onSubmit(() => {
            fetcher.submit(
              {
                folderTitle: form.values.fileName,
                folderDescription: form.values.description,
                action: "upload-file",
              },
              { method: "post" }
            );
            form.reset();
          })}
        >
          <Stack gap={"md"}>
            <TextInput
              placeholder="Enter file name"
              name="folderTitle"
              {...form.getInputProps("fileName")}
            />
            <TextInput
              placeholder="Enter a description (optional)"
              name="description"
              {...form.getInputProps("description")}
            />
            <Button
              className="self-end"
              type="submit"
              name="action"
              value="create-folder"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Upload file
            </Button>
          </Stack>
        </fetcher.Form>
      </Modal>
    </>
  );
}

export default FolderModal;
