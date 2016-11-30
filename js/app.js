const createCSV = (employer) => {

	let data = [[
		'EmployerName',
		'EventId',
		'EventName',
		'DisplayPriority',
		'RewardType',
		'PointsAwarded',
		'RewardDescription',
		'AllowSameDayDuplicates',
		'IsOngoing',
		'IsDisabled',
		'ShowInProgram',
		'IsSelfReport',
		'DataFeedMode',
		'Notify',
		'ButtonText',
		'TargetUrl',
		'EventImageUrl',
		'MaxOccurrences',
		'StartDate',
		'EndDate',
		'ViewPages',
		'Dimensions',
		'ShortDescription',
		'HtmlDescription',
		'SubgroupId',
		'Field1Name',
		'Field1Value',
    'Field2Name',
    'Field2Value',
    'Field3Name',
    'Field3Value'
	]];

  // Used by all
  const employerName = $(`#eid${employer}`).val();
	const eventId = $('#event-id').val();
  const eventName = $('#event-name').val();
	const pointsAwarded = $('#points-awarded').val();
	const eventImageUrl = $('#event-image-url').val();
  const maxOccurrences = $('#max-occurrences').val();
  const htmlDescription = $('#html-description').val();

	// Used by Verified Challenges
	const startDate = $('#start-date').val();
	const endDate = $('#end-date').val();
	const shortDescription = $('#short-description').val();

  // Targeting
  const field1Name = $('#field-1-name').val();
  const field1Value = $('#field-1-value').val();
  const field2Name = $('#field-2-name').val();
  const field2Value = $('#field-2-value').val();
  const field3Name = $('#field-3-name').val();
  const field3Value = $('#field-3-value').val();

	// CIE or Verified
	const type = $('.cie-or-verified').val();

	// For each subgroup, add a CIE
	for (let i = 0; i < $('#subgroup-number').val(); i++) {
	  const subgroupId = $(`#subgroup${i}`).val();
		// Add one CIE to the data array
		data.push([
			employerName,
			eventId,
			eventName,
			'',
			'IncentivePoints',
			pointsAwarded,
			'',
			'0',
			type === 'Verified Challenge' ? '0' : '1',
			'0',
			'1',
			'0',
		  type === 'Verified Challenge' ? '1' : '0',
			'0',
			'',
			'',
			eventImageUrl,
			maxOccurrences,
			type === 'Verified Challenge' ? startDate : '',
			type === 'Verified Challenge' ? endDate : '',
			'',
			'',
			type === 'Verified Challenge' ? `"${shortDescription.replace(/"/g, '""')}"` : '',
	    `"${htmlDescription.replace(/"/g, '""')}"`,
			subgroupId,
			field1Name,
			field1Value,
	    field2Name,
			field2Value,
	    field3Name,
			field3Value
		]);
	}

  return data;
};

const limeadeUpload = () => {

  // Upload CIE to each program
  for (let program = 0; program < $('#load-number').val(); program++) {

    const csv = createCSV(program);
    const url = 'https://mywellnessnumbers.com/api/limeade-upload-incentive-events/';

    const params = {
      e: $(`#eid${program}`).val(),
      psk: $(`#psk${program}`).val(),
			data: csv.join('\n')
    };

		// Open Modal
		$('#upload-modal').modal('show');
		$('#upload-modal-body').html('<p>Uploading...</p>');

    $.post(url, params).done((response) => {
			$('#upload-modal-body').append(`<p>${response}</p>`);
      console.log(response);
    });

  }

}

const updateNumberOfPrograms = () => {
	let containerHTML = '';

  for (let i = 0; i < $('#load-number').val(); i++) {
    containerHTML += `
      <p>
        <input type="text" id="eid${i}" placeholder="EmployerName" />
        <input type="text" id="psk${i}" placeholder="PSK" />
      </p>
    `;
  }

  $('.employers').html(containerHTML);
}

const updateNumberOfSubgroups = () => {
	let containerHTML = '';

  for (let i = 0; i < $('#subgroup-number').val(); i++) {
    containerHTML += `
      <p>
				<input id="subgroup${i}" type="text" placeholder="SubgroupId" />
      </p>
    `;
  }

  $('.subgroups').html(containerHTML);
}

// Event listeners

$('#limeade-upload').click(limeadeUpload);

$('#load-number').keyup(updateNumberOfPrograms);
$('#load-number').click(updateNumberOfPrograms);

$('#subgroup-number').keyup(updateNumberOfSubgroups);
$('#subgroup-number').click(updateNumberOfSubgroups);

$('.cie-or-verified').change(() => {
	const selection = $('.cie-or-verified').val();
	if (selection === 'Verified Challenge') {
		$('.verified-content').show();
	} else {
		$('.verified-content').hide();
	}
})