import {
  createUploadthing,
  type FileRouter,
} from "uploadthing/next";

import { UploadThingError } from "uploadthing/server";

import { getSession } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  medicalDocument: f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },

    pdf: {
      maxFileSize: "32MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await getSession();

      if (!session) {
        throw new UploadThingError(
          "Unauthorized"
        );
      }

      return {
        userId: session.userId,
      };
    })

    .onUploadComplete(
      async ({ metadata, file }) => {
        console.log(
          "Medical document uploaded by:",
          metadata.userId
        );

        console.log(
          "File:",
          file.name
        );

        return {
          url: file.ufsUrl,
          key: file.key,
          name: file.name,
          mimeType: file.type,
        };
      }
    ),
} satisfies FileRouter;

export type OurFileRouter =
  typeof ourFileRouter;