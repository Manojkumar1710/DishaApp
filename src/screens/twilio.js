import { encode } from 'base-64';

const TWILIO_ACCOUNT_SID = 'ACca889deaa442a8ec743a8501f3ab5c2c';
const TWILIO_AUTH_TOKEN = '68c0dae6db0fab07719e03cd02d2c1e3';
const TWILIO_PHONE_NUMBER = '+18382732456';

export const AUTHORITY_CONTACTS = [
  { name: 'Police Control Room (100)', phone: '7674854408' },
  { name: 'Women Helpline (181)', phone: '9014120579' },
  { name: 'Emergency (112)', phone: '9618602315' },
];

const sendSingleSMS = async (toNumber, message) => {
  const credentials = encode(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

  const body =
    'To=' +
    encodeURIComponent(toNumber) +
    '&From=' +
    encodeURIComponent(TWILIO_PHONE_NUMBER) +
    '&Body=' +
    encodeURIComponent(message);

  console.log('=== SENDING SMS ===');
  console.log('To:', toNumber);
  console.log('From:', TWILIO_PHONE_NUMBER);

  const response = await fetch(
    'https://api.twilio.com/2010-04-01/Accounts/' +
      TWILIO_ACCOUNT_SID +
      '/Messages.json',
    {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + credentials,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: body,
    },
  );

  const responseText = await response.text();
  console.log('=== TWILIO STATUS:', response.status, '===');
  console.log('=== TWILIO RESPONSE:', responseText, '===');

  let data = {};
  try {
    data = JSON.parse(responseText);
  } catch (e) {
    console.log('Response parse error:', e);
  }

  return { success: response.ok, status: response.status, data };
};

export const sendSOSSMS = async (user, location, emergencyContacts = []) => {
  const mapsLink =
    location && location.latitude !== 0
      ? 'https://maps.google.com/?q=' +
        location.latitude +
        ',' +
        location.longitude
      : 'Location unavailable';

  const message =
    'DISHA SOS ALERT - EMERGENCY\n' +
    '----------------------------\n' +
    'Name: ' +
    (user?.name || 'Unknown') +
    '\n' +
    'Phone: ' +
    (user?.phone || 'N/A') +
    '\n' +
    'Blood Group: ' +
    (user?.bloodGroup || 'N/A') +
    '\n' +
    'Address: ' +
    (user?.address || 'N/A') +
    '\n' +
    '----------------------------\n' +
    'LIVE LOCATION:\n' +
    mapsLink +
    '\n' +
    '----------------------------\n' +
    'Time: ' +
    new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) +
    '\n' +
    'PLEASE RESPOND IMMEDIATELY!';

  const allContacts = [
    ...AUTHORITY_CONTACTS,
    ...emergencyContacts.map(c => ({ name: c.name, phone: c.phone })),
  ];

  console.log('=== TOTAL CONTACTS TO NOTIFY:', allContacts.length, '===');
  allContacts.forEach((c, i) => console.log(i + 1, c.name, c.phone));

  const results = [];

  for (const contact of allContacts) {
    try {
      let phone = contact.phone.toString().replace(/[\s\-\(\)]/g, '');
      if (phone.startsWith('+91')) phone = phone.slice(3);
      if (phone.startsWith('91') && phone.length === 12) phone = phone.slice(2);
      const toNumber = '+91' + phone;

      console.log('Sending to:', contact.name, toNumber);

      const result = await sendSingleSMS(toNumber, message);

      results.push({
        contact: contact.name,
        phone: toNumber,
        success: result.success,
        error: result.data?.message || null,
      });

      console.log(
        contact.name,
        '→',
        result.success ? 'SUCCESS' : 'FAILED',
        result.status,
      );
    } catch (error) {
      console.log('ERROR sending to', contact.name, ':', error.message);
      results.push({
        contact: contact.name,
        success: false,
        error: error.message,
      });
    }
  }

  console.log('=== SMS RESULTS ===');
  results.forEach(r =>
    console.log(r.contact, r.success ? 'SENT' : 'FAILED - ' + r.error),
  );

  return results;
};
