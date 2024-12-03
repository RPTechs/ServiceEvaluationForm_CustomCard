const hubspot = require('@hubspot/api-client');
 // Initialize HubSpot API client
 const hubspotClient = new hubspot.Client({
  accessToken: process.env['PRIVATE_APP_ACCESS_TOKEN'],
});
exports.main = async (context = {}) => {
  try {
    // Get parameters from the form submission
    const { satisfaction, comments, requiresFollowUp } = context.parameters;
    const {hs_object_id} = context.propertiesToSend;


    // Update contact properties
    await hubspotClient.crm.contacts.basicApi.update(hs_object_id, {
      properties: {
        satisfaction_level: String(satisfaction),
        comments: String(comments || ''),
        requires_follow_up_: requiresFollowUp ? 'true' : 'false'
      }
    });

    return 'Contact updated successfully';

  } catch (error) {
    console.error('Error in serverless function:', error);
    return `Error updating contact: ${error.message}`;
  }
};