import EditCaseClient from "./edit-case-client";

export default async function EditCasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  return <EditCaseClient />;
}