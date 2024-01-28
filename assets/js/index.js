document.addEventListener('DOMContentLoaded', function () {
    const signInForm = document.querySelector('form');

    if(sessionStorage.getItem('passwordEntered'))
    {
        setupPage(true);
    }
    else
    {
        setupPage(false);
    }

    signInForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Check if the user has already entered the password during this session
        const passwordEntered = sessionStorage.getItem('passwordEntered');

        // Get the current date
        const currentDate = new Date();
        const dayOfWeek = getDayOfWeek(currentDate.getDay()); // Get day of the week
        const dayOfMonth = currentDate.getDate(); // Get day of the month

        // Combine day of the week and day of the month to create the password
        const generatedPassword = `${dayOfWeek}${dayOfMonth}`;

        // Get the input value for the password
        const password = document.getElementById('floatingPassword').value;

        // Check if the input password matches the generated password or has already been entered during this session
        if (password === generatedPassword || passwordEntered) {
            // Set a flag in session storage indicating that the password has been entered during this session
            sessionStorage.setItem('passwordEntered', 'true');
            startSessionTimeout();
            // setup notes page
            setupPage(true);
        } else {
            setupPage(false);
            alert('Invalid password. Please enter the correct password.');
            console.log('pw entered was: ' + password + ' correct pw was ' + generatedPassword);
        }
    });

    var sessionTimeout;

    function startSessionTimeout() {
            // Set the session timeout to 60 seconds (in milliseconds)
            var timeoutDuration = 60 * 1000;
        
            // Clear any existing timeout
            clearTimeout(sessionTimeout);
        
            // Start a new timeout
            sessionTimeout = setTimeout(function () {
                // Perform logout or session expiration actions
                signOut();
                //alert('Your session has timed out. Please sign in again.');
        
                // Redirect to the sign-in page or perform logout
                // window.location.href = '/sign-in'; // Adjust the URL as needed
                
            }, timeoutDuration);
        }
        
        // Call this function whenever there is user activity or a new page is loaded
        function resetSessionTimeout() {
            startSessionTimeout();
        }
        
        
        
        

    function enableNotesListeners()
    {
        document.addEventListener('input', function (event) {
            var target = event.target;
        
            // Check if the event was triggered by an input element (text input, checkbox, etc.)
            if (target.tagName === 'INPUT') {
                // Call the setupResto function when any input element changes
                setupNote();
            }


        });

        document.getElementById('tpInput').addEventListener('input', function (event) {
            // This function will be called whenever the content of the textarea changes
            console.log('Textarea content changed:', event.target.value);
            setupNote();
        });
        document.getElementById('LAInput').addEventListener('input', function (event) {
            // This function will be called whenever the content of the textarea changes
            console.log('Textarea content changed:', event.target.value);
            setupNote();
        });
    }



    // Function to convert numerical day of the week to its string representation
    function getDayOfWeek(dayIndex) {
        const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        return daysOfWeek[dayIndex];
    }

    //function to setup page for either sign-in or notes
    function setupPage(notes) {
        if (notes) {
            //hide sign-in page
            document.getElementById('sign-in').style.display = 'none';
            document.getElementById('notes').style.display = 'block';
            //setup notes page
            enableNotesListeners();
            setupNote();

        } else {
            //setup sign-in page
            document.getElementById('sign-in').style.display = 'block';
            document.getElementById('notes').style.display = 'none';
        }
    }

    const pastRestosOK = `
    Recent restorations inspected, in good condition & pt expresses contentment.
    `;

    var pedsModifierInsert = ``;
    var procedureInsert = ``;
    var mhxInsert = ``;
    var indicationsInsert = ``;
    var restoInputValue = ``;
    var pastRestosOKInsert = ``;
    var coeFindingsInsert = ``;
    var radiographsInsert = ``;
    var tpInsert = ``;
    var scalingInsert = ``;
    var restoInsert = ``;
    var overallExamInsert = ``;
    var basePlaced = ``;

    var largeCRConsent = `
    Before start, informed patient of significant existing defect,
    that CR alone may have unpredictable longevity, 
    Discussed contributing factors including but not ltd to: 
    bruxism, high caries risk classification, longstanding defect, h/o previous repair,
    & significant chance of postop sensitivity and/or need for further tx, such as RCT, crown, or even extraction, possibly at specialist / at addl time and cost.
    Despite this, pt declines alt/no tx at this time & opts to proceed with CR today.
    `;

    var addlConsentInsert = ``;
    var longevityCheck = ``;
    var bruxismCheck = ``;
    var cariesRiskCheck = ``;
    var longstandingCheck = ``;
    var prevRepairCheck = ``;
    var contrFactorsInsert = ``;
    var LAinsert = ``;
    var coeFindings =
    `
    Class I bilateral molar, OJ 2mm OB 20%
    Caries as charted - No active intraoral caries
    Caries risk high
    Signs of attrition/bruxism
    Perio exam done, PSR 3-2-3 3-2-3, perio dx: gingivitis
    OH poor, Generalized moderate plaque and calculus, gen mod inflammation
    `;

    const scalingSegment = `Scaling done with hand & ultrasonic scalers to complete removal of plaque and calculus.
    Polished with prophy angle/paste.
    Demonstrated and discussed individual OHI, answered all q’s and pt understood.`;

    var restoSurfaces = null;

 

    //if insert is true, insert the wrapper text
    //into 'note-text' <samp> tag
    //if not true, find text matching wrapperIntro and wrapperEnding and remove if it is there
    function setupNote()
    {
        console.log('setupNote() called');
        resetSessionTimeout();
        procedureInsert = ``;
        indicationsInsert = document.getElementById('restoIndicationsInput').value.trim();
        restoInputValue = document.getElementById('restoSurfacesInput').value.trim();
        LAinsert = document.getElementById('LAInput').value.trim();
        coeFindingsInsert = document.getElementById('examInput').value.replace(/\n/g, '<br>');
        console.log('coeFindingsInsert is ' + coeFindingsInsert);

        longevityCheck = document.getElementById('longevityCheck').checked ? `that CR alone may have unpredictable longevity, ` : ``;
        bruxismCheck = document.getElementById('bruxismCheck').checked ? `bruxism, ` : ``;
        cariesRiskCheck = document.getElementById('cariesRiskCheck').checked ? `high caries risk classification, ` : ``;
        longstandingCheck = document.getElementById('longstandingCheck').checked ? `longstanding defect, ` : ``;
        prevRepairCheck = document.getElementById('prevRepairCheck').checked ? `h/o previous repair, ` : ``;
        //check if any above are not null besides longevity
        contrFactorsInsert = (bruxismCheck.length != 0 || cariesRiskCheck.length != 0 || longstandingCheck.length != 0 || prevRepairCheck.length != 0) ? `Discussed contributing factors including but not ltd to: ` : ``;
        


        addlConsentInsert = ``;
        //check if largeCr box is checked
        if(document.getElementById('largeCRCheck').checked)
        {
            console.log('largeCRCheck checked');
            //add on largeCRConsent to addlConsentInsert
            addlConsentInsert =
            `
            Before start, informed patient of significant existing defect,
            ${longevityCheck} 
            ${contrFactorsInsert}
            ${bruxismCheck} ${cariesRiskCheck} ${longstandingCheck} ${prevRepairCheck}
            & significant chance of postop sensitivity and/or need for further tx, such as RCT, crown, or even extraction, possibly at specialist / at addl time and cost.
            Despite this, pt declines alt/no tx at this time & opts to proceed with CR today.
            `;
        }
        
        pedsModifierInsert = ``;
        if(document.getElementById('pedsCheck').checked)
        {
            
            //add on peds modifier to pedsModifierInsert
            pedsModifierInsert += ` and parent/guardian `;
            console.log('PEDS checked, pedsModifierInsert is ' + pedsModifierInsert);
        }


        if (restoInputValue.length != 0) 
        {
            console.log('Input field is not empty');
            //add on input field contents to procedureInsert
            procedureInsert += restoInputValue + ` due to ${indicationsInsert}`;
            basePlaced = document.getElementById('baseCheck').checked ? `dycal CaOH base/IPC per mfr recs, ` : ``;
            restoInsert = 
            `
            LA: ${LAinsert} <br>
            ${restoInputValue} preparation and caries removal complete, no pulpal involvement <br>
            ${basePlaced} <br>
            etch w/ phosphoric acid and rinse per mfr recs <br>
            restored with voco futurabond U and 3M filtek supreme A2B per mfr recs all excess removed, adjusted to proper contour, contacts, and marginal seal, and polished.
            <br>Pt ${pedsModifierInsert} happy with look, feel, and function of today's restorative.
           <br> No complications during procedure.
            `;
        }
        else
        {
            restoInsert = ``;
        }
        
        if(document.getElementById('coeCheck').checked)
        {
            console.log('COE checked');
            //add on coeFindings to indicationsInsert
            procedureInsert += `COE, `;
        }
    
        //check mhx input field and input the contents into mhxinsert
        if(document.getElementById('mhxInput').value.trim().length != 0)
        {
            mhxInsert = ` reports ${document.getElementById('mhxInput').value.trim()} otherwise `;
        }
        else
        {
            mhxInsert = ``;
        }
    
        if(document.getElementById('pastRestosOKCheck').checked)
        {
            pastRestosOKInsert = pastRestosOK;
        }
        else
        {
            pastRestosOKInsert = ``;
        }

        
        //insert examFindings into coeFindingsInsert
        
        if(document.getElementById('radiographsInput').value.trim().length !== 0)
        {
            radiographsInsert = document.getElementById('radiographsInput').value.trim();
        }
        else
        {
            radiographsInsert = `none/previous`;
        }
    
        if (document.getElementById('tpInput').value.trim().length !== 0) {
            tpInsert = document.getElementById('tpInput').value.replace(/\n/g, '<br>');
        }
        else
        {
            tpInsert = ``;
        }

        if(document.getElementById('coeCheck').checked || document.getElementById('specCheck').checked)
        {
            overallExamInsert = 
                `IOE:
                ${coeFindingsInsert}
                OCS performed, negative, no pigmented/exophytic/ulcerative lesions.
                EOE:
                TMJ & MIO WNL
                No swelling/asymmery/lymphadenopathy.
                Radiographs: ${radiographsInsert}
            
                TxP and recommendations:
                ${tpInsert}
            
                Disc tx options and recommendations,
                RBAs of each including no tx and risks of delayed / no tx. Pt ${pedsModifierInsert} understood and agreed.
                `;
        }
        else
        {
            overallExamInsert = ``;
            console.log('overallExamInsert is ' + overallExamInsert + 'as coeFindingsInsert is ' + coeFindingsInsert);
        }
        
        var fluorideSegment = document.getElementById('fluorideCheck').checked ? `Fluoride varnish applied per mfr recs.` : ``;


        if(document.getElementById('scalingCheck').checked)
        {
            scalingInsert = scalingSegment + ` ` + fluorideSegment;
            var scalingProcedureInsert = document.getElementById('fluorideCheck').checked ? 
            `scaling, polishing, and fluoride varnish, ` : `scaling and polishing, `;
            procedureInsert += scalingProcedureInsert;
        }
        else
        {
            scalingInsert = ``;
        }


        document.getElementById('note-text').innerHTML = ``;

       
    
        // Get the element by ID
var noteTextElement = document.getElementById('note-text');

// Get the innerHTML content
var noteTextContent = `
    Pt ${pedsModifierInsert} presented for
    ${procedureInsert}
    <br>
    MHx reviewed, pt ${pedsModifierInsert} ${mhxInsert} denies allergies/medications/conditions, no contraindications. 
    <br>
    <br>
    ${addlConsentInsert}
    <br>
    Pt ${pedsModifierInsert} aware and understands procedure and BRAN before start, all questions answered, verbal/written informed consent obtained. 
    <br>
    ${pastRestosOKInsert}
    <br>
    ${overallExamInsert}
    <br>
    ${scalingInsert}
    <br>
    ${restoInsert}
    <br>
    POI given and understood, perioperative hard/soft tissues inspected - free of involvement,<br>
     pt ${pedsModifierInsert} happy with visit & left in good condition without questions or complications. <br>
    NV: <br>
    CDA <br>
    SC
`;

// Remove more than two consecutive line breaks represented by <br> tags
var cleanedContent = noteTextContent.replace(/(<br>\s*){2,}/gi, '<br>');

// Set the cleaned content back to the element
noteTextElement.innerHTML = cleanedContent;


    }
});

function copyToClipboard() {
    // Get the element by ID
    var noteTextElement = document.getElementById('note-text');

    // Get the text content
    var noteTextContent = noteTextElement.textContent || noteTextElement.innerText;

    // Remove leading spaces from each line
    var cleanedContent = noteTextContent.split('\n').map(line => line.trim()).join('\n');

    // Remove consecutive empty lines
    cleanedContent = cleanedContent.replace(/\n{3,}/g, '\n\n');

    // Remove multiple spaces
    cleanedContent = cleanedContent.replace(/ {2,}/g, ' ');

    // Create a temporary textarea element
    var textarea = document.createElement('textarea');
    textarea.value = cleanedContent;

    // Make the textarea non-editable to avoid flickering
    textarea.setAttribute('readonly', '');

    // Hide the textarea from view
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';

    // Append the textarea to the document
    document.body.appendChild(textarea);

    // Select the text inside the textarea
    textarea.select();

    // Execute the copy command
    document.execCommand('copy');

    // Remove the temporary textarea
    document.body.removeChild(textarea);

    // Log a message to indicate that copying was successful
    console.log('Text copied to clipboard:', cleanedContent);
}



var copyButton = document.getElementById('copyButton');
var originalContent = copyButton.innerHTML;
var signOutButton = document.getElementById('signOutButton');

copyButton.addEventListener('click', function() {
// Store the original SVG content

copyToClipboard();
    // Change the SVG
    copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-check" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
    </svg>`;

    // After 1 second, change it back to the original SVG
    setTimeout(function() {
        copyButton.innerHTML = originalContent;
    }, 1000);
});

signOutButton.addEventListener('click', function() {
    sessionStorage.removeItem('passwordEntered');
    location.reload();
});

function signOut()
{
    sessionStorage.removeItem('passwordEntered');
    location.reload();
}