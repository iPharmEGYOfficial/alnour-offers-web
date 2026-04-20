import { socialChannels } from "../config/socialChannels";
import { socialCampaigns } from "../config/socialCampaigns";

export function getSocialChannels() {
  return (socialChannels || []).map((item) => ({
    ...item,
    isActive: item.isActive ?? true,
  }));
}

export function getActiveSocialChannels() {
  return getSocialChannels().filter((item) => item.isActive !== false);
}

export function getSocialChannelByKey(key) {
  const safeKey = String(key ?? "")
    .trim()
    .toLowerCase();
  return (
    getSocialChannels().find(
      (item) =>
        String(item.key ?? "")
          .trim()
          .toLowerCase() === safeKey,
    ) || null
  );
}

export function getSocialCampaigns() {
  return (socialCampaigns || []).map((item) => ({
    ...item,
    status: item.status || "active",
  }));
}

export function getActiveSocialCampaigns() {
  return getSocialCampaigns().filter(
    (item) => String(item.status).toLowerCase() === "active",
  );
}

export function getCampaignsByChannel(channel) {
  const safeChannel = String(channel ?? "")
    .trim()
    .toLowerCase();
  return getSocialCampaigns().filter(
    (item) =>
      String(item.channel ?? "")
        .trim()
        .toLowerCase() === safeChannel,
  );
}

const socialService = {
  getSocialChannels,
  getActiveSocialChannels,
  getSocialChannelByKey,
  getSocialCampaigns,
  getActiveSocialCampaigns,
  getCampaignsByChannel,
};

export default socialService;

