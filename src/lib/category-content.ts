export const categoryContent: Record<string, { description: string; introduction: string }> = {
  'Identity and access': {
    description: 'Diagnose Microsoft Entra sign-in and access errors by checking the exact error, tenant, application, user, and policy result before changing access.',
    introduction: 'These guides cover Microsoft Entra sign-in and authorization failures. Start with the exact AADSTS code and the matching sign-in event; compare the user, tenant, application, and policy result before changing assignments or authentication settings.',
  },
  'Endpoint Management': {
    description: 'Troubleshoot Windows device settings, application behavior, policy, and remote-session issues with checks scoped to the affected device or user.',
    introduction: 'Use these guides for issues at the Windows device, application, or session level. First identify whether the behavior follows the device, user, network, or applied policy; then test a narrowly scoped change and verify it on the affected endpoint.',
  },
  Deployment: {
    description: 'Investigate Windows deployment and copy failures by locating the failing stage, validating paths and prerequisites, and checking the resulting logs.',
    introduction: 'Deployment failures can come from different stages, including network boot, source selection, and file operations. Pin down the first failing step and its log evidence before changing infrastructure or retrying a broad deployment.',
  },
  'Directory Services': {
    description: 'Diagnose Windows Server DNS and Active Directory symptoms using replication, registration, and event evidence before changing records or services.',
    introduction: 'These guides focus on DNS and Active Directory behavior. Check which server produced the event, whether replication and name resolution are healthy, and what the DNS logs show before changing records or restarting services.',
  },
  Email: {
    description: 'Troubleshoot Outlook and Exchange delivery, forwarding, and hybrid issues by separating client symptoms from service-side policy and configuration.',
    introduction: 'Email symptoms can originate in the Outlook client, Exchange Online policy, or a hybrid dependency. Identify where the message or workflow stops, then use the relevant client state, message details, or service logs to narrow the cause.',
  },
  'Windows servicing': {
    description: 'Diagnose Windows Update and .NET Framework servicing errors by matching the code to component, source, policy, and operating-system version evidence.',
    introduction: 'Servicing error codes can point to different failures even when they appear during the same update or feature installation. Match the exact code to the relevant Windows and component logs, confirm the operating-system source, and choose a repair that fits that evidence.',
  },
};
