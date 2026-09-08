import CaseDetailsClient from "./case-details-client";

export default async function CasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <CaseDetailsClient id={id} />;
}