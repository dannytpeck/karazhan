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
	const displayPriority = $('#display-priority').val();
	const pointsAwarded = $('#points-awarded').val();
	const showInProgram = $('#show-in-program').val();
	const eventImageUrl = $('#event-image-url').val();
  const maxOccurrences = $('#max-occurrences').val();
  const htmlDescription = $('#html-description').val();

  // Targeting
  const field1Name = $('#field-1-name').val();
  const field1Value = $('#field-1-value').val();
  const field2Name = $('#field-2-name').val();
  const field2Value = $('#field-2-value').val();
  const field3Name = $('#field-3-name').val();
  const field3Value = $('#field-3-value').val();

	// For each subgroup, add a CIE
	for (let i = 0; i < $('#subgroup-number').val(); i++) {
	  const subgroupId = $(`#subgroup${i}`).val();
		// Add one CIE to the data array
		data.push([
			employerName,
			eventId,
			eventName,
			displayPriority,
			'IncentivePoints',
			pointsAwarded,
			'',
			'0',
			'0',
			'0',
			showInProgram,
			'0',
		  '0',
			'0',
			'',
			'',
			eventImageUrl,
			maxOccurrences,
			'',
			'',
			'',
			'',
			'',
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
    const url = 'https://calendarbuilder.dev.adurolife.com/limeade-upload/';

    const params = {
      e: $(`#eid${program}`).val(),
      psk: $(`#psk${program}`).val(),
			data: csv.join('\n'),
			type: 'IncentiveEvents'
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

// Updates number of Client Programs to upload to based on:
// changing value of #load-number input box
// or uploading a JSON file to parse from
// TODO: Fix bug where all inputs are cleared if you load from JSON then change input box value
const updateNumberOfPrograms = (numberOfPrograms) => {
	let containerHTML = '';

	// checks if numberOfPrograms was passed as a parameter/number
	if (typeof numberOfPrograms !== 'number') {
		// if it's not, set it to equal the value of #load-number input box
		numberOfPrograms = $('#load-number').val();
	}

  for (let i = 0; i < numberOfPrograms; i++) {
    containerHTML +=
		`<p>
      <input type="text" id="eid${i}" placeholder="EmployerName" />
    	<input type="text" id="psk${i}" placeholder="PSK" />
    </p>`;
  }

  $('.employers').html(containerHTML);
}

const updateNumberOfSubgroups = () => {
	let containerHTML = '';

  for (let i = 0; i < $('#subgroup-number').val(); i++) {
    containerHTML +=
		`<p>
			<input id="subgroup${i}" type="text" placeholder="SubgroupId" />
    </p>`;
  }

  $('.subgroups').html(containerHTML);
}

function handleJsonFiles() {
	var reader = new FileReader();
	reader.onload = function() {
		// work with the JSON data
		var json = JSON.parse(reader.result);
		updateNumberOfPrograms(json.clients.length);
		$('#load-number').val(json.clients.length)
		console.log(json);
		console.log(json.clients.length + " clients in json");

		// Populate the client input fields
		for (let i = 0; i < json.clients.length; i++) {
			$('#eid' + i).val(json.clients[i].e);
			$('#psk' + i).val(json.clients[i].psk);
		}

	};
	// start reading the file. When it is done, calls the onload event defined above.
	reader.readAsBinaryString(document.querySelector('#json-input').files[0]);
}

// From https://gist.github.com/iwek/7154578#file-csv-to-json-js
// Convert csv string to JSON
function csvToJson(csv) {
  var lines = csv.split("\n");
  var result = [];
  var headers = lines[0].split(",");

  for(var i=1; i<lines.length; i++) {
    var obj = {};

    var row = lines[i],
      queryIdx = 0,
      startValueIdx = 0,
      idx = 0;

    if (row.trim() === '') { continue; }

    while (idx < row.length) {
      /* if we meet a double quote we skip until the next one */
      var c = row[idx];

      if (c === '"') {
        do { c = row[++idx]; } while (c !== '"' && idx < row.length - 1);
      }

      if (c === ',' || /* handle end of line with no comma */ idx === row.length - 1) {
        /* we've got a value */
        var value = row.substr(startValueIdx, idx - startValueIdx).trim();

        /* skip first double quote */
        if (value[0] === '"') { value = value.substr(1); }
        /* skip last comma */
        if (value[value.length - 1] === ',') { value = value.substr(0, value.length - 1); }
        /* skip last double quote */
        if (value[value.length - 1] === '"') { value = value.substr(0, value.length - 1); }

        var key = headers[queryIdx++];
        obj[key] = value;
        startValueIdx = idx + 1;
      }

      ++idx;
    }

    result.push(obj);
  }
  return result;
}

function handleCsvFiles() {
	var reader = new FileReader();
	reader.onload = function() {
		// Do something with the data
		var cie = csvToJson(reader.result)[0];
		console.log(cie);

		// Populate the input fields
		$('#event-name').val(cie.EventName);
		$('#event-id').val(cie.EventId);
		$('#points-awarded').val(cie.PointsAwarded);
		$('#event-image-url').val(cie.EventImageUrl);
		$('#max-occurrences').val(cie.MaxOccurrences);
		$('#display-priority').val(cie.DisplayPriority);
		$('#show-in-program').val(cie.ShowInProgram);
		$('#html-description').val(cie.HtmlDescription.replace(/""/g, '"'));
		$('#subgroup0').val(cie.SubgroupId);
		$('#field-1-name').val(cie.Field1Name);
		$('#field-1-value').val(cie.Field1Value);
		$('#field-2-name').val(cie.Field2Name);
		$('#field-2-value').val(cie.Field2Value);
		$('#field-3-name').val(cie.Field3Name);
		$('#field-3-value').val(cie.Field3Value);

	};
	// start reading the file. When it is done, calls the onload event defined above.
	reader.readAsBinaryString(document.querySelector('#csv-input').files[0]);
}


// Event listeners
$('#limeade-upload').click(limeadeUpload);

$('#load-number').keyup(updateNumberOfPrograms);
$('#load-number').click(updateNumberOfPrograms);

$('#subgroup-number').keyup(updateNumberOfSubgroups);
$('#subgroup-number').click(updateNumberOfSubgroups);

$('#json-import').click(function(e) {
	$('#json-input').click();
	e.preventDefault();
});

$('#csv-import').click(function(e) {
	$('#csv-input').click();
	e.preventDefault();
});
