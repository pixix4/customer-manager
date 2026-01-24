import {
  getBundleType,
  getTauriVersion,
  getVersion,
} from "@tauri-apps/api/app";
import { check, Update } from "@tauri-apps/plugin-updater";

import { createResource, Show } from "solid-js";
import styles from "./VersionPanel.module.css";
import Button from "../components/Button";
import { relaunch } from "@tauri-apps/plugin-process";
import { usePreferences } from "../preferences";

type AppInfo = {
  version: string;
  tauriVersion: string;
  bundleType: string;
};

type UpdateInfo = {
  update: Update | null;
};

async function getAppInfo(): Promise<AppInfo> {
  return {
    version: await getVersion(),
    tauriVersion: await getTauriVersion(),
    bundleType: await getBundleType(),
  };
}

async function getUpdateInfo(): Promise<UpdateInfo> {
  return {
    update: await check(),
  };
}

export default function VersionPanel() {
  const { t } = usePreferences();

  const [appInfo] = createResource(getAppInfo);
  const [updateInfo] = createResource(getUpdateInfo);

  return (
    <div>
      <div class={styles.versions}>
        <span>Version: {appInfo()?.version ?? "-"}</span>
        <span>Tauri-Version: {appInfo()?.tauriVersion ?? "-"}</span>
        <span>Bundle-Type: {appInfo()?.bundleType ?? "-"}</span>
      </div>

      <Show
        when={updateInfo()?.update}
        fallback={<div>{t("settings.update.noUpdateAvailable")}</div>}
      >
        <UpdateView update={updateInfo()?.update!!} />
      </Show>
    </div>
  );
}

function UpdateView(props: { update: Update }) {
  const { t } = usePreferences();

  const handleOnUpdate = async () => {
    let downloaded = 0;
    let contentLength = 0;

    await props.update.downloadAndInstall((event) => {
      switch (event.event) {
        case "Started":
          contentLength = event.data.contentLength ?? 0;
          console.log(`started downloading ${event.data.contentLength} bytes`);
          break;
        case "Progress":
          downloaded += event.data.chunkLength;
          console.log(`downloaded ${downloaded} from ${contentLength}`);
          break;
        case "Finished":
          console.log("download finished");
          break;
      }
    });

    console.log("update installed");
    await relaunch();
  };

  return (
    <div>
      <div>
        {t("settings.update.updateAvailable", {
          version: props.update.version,
        })}
      </div>
      <Button onClick={handleOnUpdate}>
        {t("settings.update.installUpdate")}
      </Button>
    </div>
  );
}
