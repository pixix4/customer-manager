import {
  getBundleType,
  getTauriVersion,
  getVersion,
} from "@tauri-apps/api/app";
import { check, Update } from "@tauri-apps/plugin-updater";

import { createResource, Match, Switch } from "solid-js";
import styles from "./VersionPanel.module.css";
import Button from "../components/Button";
import { relaunch } from "@tauri-apps/plugin-process";
import { useTranslation } from "../translation";
import { RiSystemCheckLine, RiSystemErrorWarningLine } from "solid-icons/ri";
import LoadingSpinner from "../components/LoadingSpinner";

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
  const { t } = useTranslation();

  const [appInfo] = createResource(getAppInfo);
  const [updateInfo] = createResource(getUpdateInfo);

  const handleOnUpdate = async () => {
    let downloaded = 0;
    let contentLength = 0;

    const update = updateInfo()?.update;
    if (!update) {
      return;
    }

    await update.downloadAndInstall((event) => {
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
      <Switch>
        <Match when={!updateInfo()}>
          <div class={styles.updateInfo} data-type="loading">
            <LoadingSpinner size={2} />
            <span>{t("settings.update.loading")}</span>
          </div>
        </Match>

        <Match when={!updateInfo()?.update}>
          <div class={styles.updateInfo} data-type="up-to-date">
            <RiSystemCheckLine />
            <span>{t("settings.update.noUpdateAvailable")}</span>
          </div>
        </Match>

        <Match when={updateInfo()?.update}>
          <div class={styles.updateInfo} data-type="available">
            <RiSystemErrorWarningLine />
            <span>
              {t("settings.update.updateAvailable", {
                version: updateInfo()?.update?.version ?? "-",
              })}
            </span>
            <Button color="primary" onClick={handleOnUpdate}>
              {t("settings.update.installUpdate")}
            </Button>
          </div>
        </Match>
      </Switch>

      <div class={styles.versions}>
        <span>Version: {appInfo()?.version ?? "-"}</span>
        <span>Tauri-Version: {appInfo()?.tauriVersion ?? "-"}</span>
        <span>Bundle-Type: {appInfo()?.bundleType ?? "-"}</span>
      </div>
    </div>
  );
}
