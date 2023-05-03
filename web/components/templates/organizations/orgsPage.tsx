import { Tab } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import {
  BuildingOfficeIcon,
  CreditCardIcon,
  KeyIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import generateApiKey from "generate-api-key";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DEMO_EMAIL } from "../../../lib/constants";
import { hashAuth } from "../../../lib/hashClient";
import { middleTruncString } from "../../../lib/stringHelpers";

import { useGetKeys } from "../../../services/hooks/keys";
import { Database } from "../../../supabase/database.types";
import { clsx } from "../../shared/clsx";
import LoadingAnimation from "../../shared/loadingAnimation";
import useNotification from "../../shared/notification/useNotification";
import ThemedModal from "../../shared/themed/themedModal";
import ThemedTable from "../../shared/themed/themedTable";
import ThemedTabs from "../../shared/themed/themedTabs";
import { useQuery } from "@tanstack/react-query";
import { Members } from "../../../pages/api/organization/[id]/members";
import { Owner } from "../../../pages/api/organization/[id]/owner";
import { useGetOrgs } from "../../../services/hooks/organizations";
import { getUSDate } from "../../shared/utils/utils";
import OrgCard from "./orgCard";
import { useOrg } from "../../shared/layout/organizationContext";

interface OrgsPageProps {}

const OrgsPage = (props: OrgsPageProps) => {
  const [orgName, setOrgName] = useState("");

  const user = useUser();
  const supabaseClient = useSupabaseClient<Database>();
  const orgContext = useOrg();
  const { setNotification } = useNotification();

  const yourOrgs = orgContext?.allOrgs.filter((d) => d.owner === user?.id);
  const otherOrgs = orgContext?.allOrgs?.filter((d) => d.owner !== user?.id);

  return (
    <div className="mt-8 flex flex-col text-gray-900 max-w-2xl space-y-8">
      <div className="flex flex-row items-end gap-5">
        <div className="w-full space-y-1.5 text-sm">
          <label htmlFor="api-key">Organization Name</label>
          <input
            type="text"
            name="api-key"
            id="api-key"
            className={clsx(
              "block w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm"
            )}
            placeholder="Your shiny org name"
            onChange={(e) => setOrgName(e.target.value)}
            value={orgName}
          />
        </div>
        <button
          onClick={async () => {
            if (!orgName || orgName === "") {
              setNotification("Please provide an organization name", "error");
              return;
            }
            const { data, error } = await supabaseClient
              .from("organization")
              .insert([
                {
                  name: orgName,
                  owner: user?.id!,
                },
              ])
              .select("*");
            if (error) {
              setNotification("Failed to create organization", "error");
            } else {
              setNotification("Organization created successfully", "success");
            }
            console.log(1);
            orgContext?.refetchOrgs();
          }}
          className="bg-gray-900 hover:bg-gray-700 whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
        >
          Create New Organization
        </button>
      </div>
      <div className="border-t border-gray-200 flex flex-col space-y-4 py-4">
        <p className="text-md font-semibold">Your Organizations</p>
        <ul className="flex flex-wrap gap-4">
          {orgContext ? (
            yourOrgs?.map((org) => (
              <OrgCard
                org={org}
                key={org.id}
                refetchOrgs={orgContext.refetchOrgs}
                isOwner
              />
            ))
          ) : (
            <div className="h-40 w-full max-w-xs bg-gray-300 rounded-xl animate-pulse" />
          )}
        </ul>
      </div>
      {orgContext?.allOrgs && (
        <div className="border-t border-gray-200 flex flex-col space-y-4 py-4">
          <p className="text-md font-semibold">Other Organizations</p>
          <ul className="flex flex-wrap gap-4">
            {otherOrgs?.map((org) => (
              <OrgCard
                org={org}
                key={org.id}
                refetchOrgs={orgContext.refetchOrgs}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrgsPage;