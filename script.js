// State and City Data
let stateData = {};
let pinCodeData = {};
let areaData = {};

// Language Data
let languagesData = [];

// Load State and City Data
async function loadStateData() {
    loadInlineStateData();
    populateStates();
}

function loadInlineStateData() {
    stateData = {"Andaman and Nicobar Islands":["Port Blair","Diglipur","Mayabunder","Rangat"],
    "Andhra Pradesh":["Visakhapatnam","Vijayawada","Guntur","Nellore","Kurnool","Rajahmundry","Kakinada","Tirupati","Anantapur","Kadapa"],"Arunachal Pradesh":["Itanagar","Naharlagun","Pasighat","Tawang","Ziro","Bomdila","Tezu","Seppa"],"Assam":["Guwahati","Silchar","Dibrugarh","Jorhat","Nagaon","Tinsukia","Tezpur","Bongaigaon"],"Bihar":["Patna","Gaya","Bhagalpur","Muzaffarpur","Purnia","Darbhanga","Bihar Sharif","Arrah"],"Chhattisgarh":["Raipur","Bhilai","Bilaspur","Korba","Durg","Rajnandgaon","Jagdalpur","Raigarh"],
    "Goa":["Panaji","Margao","Vasco da Gama","Mapusa","Ponda","Bicholim","Curchorem"],
    "Gujarat":["Ahmedabad","Surat","Vadodara","Rajkot","Bhavnagar","Jamnagar","Junagadh","Gandhinagar","Anand"],
    "Haryana":["Faridabad","Gurgaon","Panipat","Ambala","Yamunanagar","Rohtak","Hisar","Karnal","Sonipat"],
    "Himachal Pradesh":["Shimla","Dharamshala","Solan","Mandi","Palampur","Kullu","Hamirpur","Bilaspur"],
    "Jharkhand":["Ranchi","Jamshedpur","Dhanbad","Bokaro","Deoghar","Hazaribagh","Giridih","Ramgarh"],
    "Karnataka":["Bangalore","Mysore","Mangalore","Hubli","Belgaum","Gulbarga","Davangere","Bellary","Tumkur"],"Kerala":["Thiruvananthapuram","Kochi","Kozhikode","Kollam","Thrissur","Palakkad","Alappuzha","Kannur","Kottayam"],"Madhya Pradesh":["Indore","Bhopal","Jabalpur","Gwalior","Ujjain","Sagar","Dewas","Satna","Ratlam"],"Maharashtra":["Mumbai","Pune","Nagpur","Thane","Nashik","Aurangabad","Solapur","Amravati","Kolhapur","Navi Mumbai"],"Manipur":["Imphal","Thoubal","Bishnupur","Churachandpur","Kakching","Ukhrul"],"Meghalaya":["Shillong","Tura","Nongstoin","Jowai","Baghmara","Williamnagar"],"Mizoram":["Aizawl","Lunglei","Champhai","Serchhip","Kolasib","Lawngtlai"],"Nagaland":["Kohima","Dimapur","Mokokchung","Tuensang","Wokha","Zunheboto"],"Odisha":["Bhubaneswar","Cuttack","Rourkela","Berhampur","Sambalpur","Puri","Balasore","Bhadrak"],"Punjab":["Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Mohali","Pathankot","Hoshiarpur"],"Rajasthan":["Jaipur","Jodhpur","Kota","Bikaner","Ajmer","Udaipur","Bhilwara","Alwar","Sikar"],"Sikkim":["Gangtok","Namchi","Mangan","Gyalshing","Rangpo","Jorethang"],"Tamil Nadu":["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tirunelveli","Erode","Vellore","Thoothukudi"],"Telangana":["Hyderabad","Warangal","Nizamabad","Khammam","Karimnagar","Ramagundam","Mahbubnagar"],"Tripura":["Agartala","Udaipur","Dharmanagar","Ambassa","Kailasahar","Belonia"],"Uttar Pradesh":["Lucknow","Kanpur","Ghaziabad","Agra","Varanasi","Meerut","Prayagraj","Bareilly","Aligarh","Noida"],"Uttarakhand":["Dehradun","Haridwar","Roorkee","Haldwani","Rudrapur","Kashipur","Rishikesh"],"West Bengal":["Kolkata","Howrah","Durgapur","Asansol","Siliguri","Bardhaman","Malda","Baharampur"],"Chandigarh":["Chandigarh"],"Dadra and Nagar Haveli and Daman and Diu":["Daman","Diu","Silvassa"],"Delhi":["New Delhi","North Delhi","South Delhi","East Delhi","West Delhi","Central Delhi"],"Jammu and Kashmir":["Srinagar","Jammu","Anantnag","Baramulla","Udhampur","Kathua"],"Ladakh":["Leh","Kargil","Nubra","Zanskar"],"Lakshadweep":["Kavaratti","Agatti","Amini","Andrott"],"Puducherry":["Puducherry","Karaikal","Mahe","Yanam"]};
    
    // Generate pin codes
    Object.keys(stateData).forEach(state => {
        pinCodeData[state] = stateData[state].map((city, index) => {
            return `${(110001 + index * 100).toString().substring(0, 6)}`;
        });
    });
    
    // Generate sample areas for each city
    Object.keys(stateData).forEach(state => {
        stateData[state].forEach(city => {
            areaData[city] = [
                `${city} North`,
                `${city} South`,
                `${city} East`,
                `${city} West`,
                `${city} Central`
            ];
        });
    });
}

function populateStates() {
    const stateSelect = document.getElementById('state');
    const states = Object.keys(stateData).sort();
    
    stateSelect.innerHTML = '<option value="">-- Select State --</option>';
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });
}

function populateCities(state) {
    const citySelect = document.getElementById('city');
    const citiesData = stateData[state] || [];
    
    citySelect.innerHTML = '<option value="">-- Select City --</option>';
    citiesData.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
    citySelect.disabled = false;
    
    // Populate multiple cities
    populateMultipleCities(state);
    
    // Populate pin codes
    populatePinCodes(state);
}

function populateMultipleCities(state) {
    const container = document.getElementById('cities');
    const searchBox = document.getElementById('citySearch');
    const citiesData = stateData[state] || [];
    
    searchBox.style.display = 'block';
    searchBox.value = '';
    container.classList.remove('disabled');
    container.innerHTML = '';
    
    citiesData.forEach((cityItem, index) => {
        const item = document.createElement('div');
        item.className = 'checkbox-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `city-multi-${index}`;
        checkbox.value = cityItem;
        checkbox.name = 'cities';
        checkbox.addEventListener('change', function() {
            updateSelectedCities();
            updateAreas();
        });
        
        const label = document.createElement('label');
        label.htmlFor = `city-multi-${index}`;
        label.textContent = cityItem;
        
        item.appendChild(checkbox);
        item.appendChild(label);
        container.appendChild(item);
    });
}

function populatePinCodes(state) {
    const container = document.getElementById('pinCodes');
    const searchBox = document.getElementById('pinSearch');
    const pinCodesData = pinCodeData[state] || [];
    
    searchBox.style.display = 'block';
    searchBox.value = '';
    container.classList.remove('disabled');
    container.innerHTML = '';
    
    pinCodesData.forEach((pin, index) => {
        const item = document.createElement('div');
        item.className = 'checkbox-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `pin-${index}`;
        checkbox.value = pin;
        checkbox.name = 'pinCodes';
        checkbox.addEventListener('change', updateSelectedPins);
        
        const label = document.createElement('label');
        label.htmlFor = `pin-${index}`;
        label.textContent = pin;
        
        item.appendChild(checkbox);
        item.appendChild(label);
        container.appendChild(item);
    });
}

function updateSelectedCities() {
    const checkboxes = document.querySelectorAll('#cities input[type="checkbox"]:checked');
    const tagsDiv = document.getElementById('selectedCitiesTags');
    
    if (checkboxes.length > 0) {
        tagsDiv.style.display = 'block';
        tagsDiv.innerHTML = Array.from(checkboxes)
            .map(cb => `<span class="tag">${cb.value}</span>`)
            .join('');
    } else {
        tagsDiv.style.display = 'none';
    }
}

function updateAreas() {
    const selectedCities = Array.from(document.querySelectorAll('#cities input[type="checkbox"]:checked')).map(cb => cb.value);
    const container = document.getElementById('areas');
    const searchBox = document.getElementById('areaSearch');
    
    if (selectedCities.length === 0) {
        searchBox.style.display = 'none';
        container.classList.add('disabled');
        container.innerHTML = '<p style="color: #888; text-align: center;">Select cities first</p>';
        document.getElementById('selectedAreasTags').style.display = 'none';
        return;
    }
    
    // Collect all areas from selected cities
    const allAreas = [];
    selectedCities.forEach(cityItem => {
        if (areaData[cityItem]) {
            areaData[cityItem].forEach(area => {
                allAreas.push({ city: cityItem, area });
            });
        }
    });
    
    searchBox.style.display = 'block';
    searchBox.value = '';
    container.classList.remove('disabled');
    container.innerHTML = '';
    
    allAreas.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `area-${index}`;
        checkbox.value = item.area;
        checkbox.name = 'areas';
        checkbox.addEventListener('change', updateSelectedAreas);
        
        const label = document.createElement('label');
        label.htmlFor = `area-${index}`;
        label.textContent = item.area;
        
        div.appendChild(checkbox);
        div.appendChild(label);
        container.appendChild(div);
    });
}

function updateSelectedAreas() {
    const checkboxes = document.querySelectorAll('#areas input[type="checkbox"]:checked');
    const tagsDiv = document.getElementById('selectedAreasTags');
    
    if (checkboxes.length > 0) {
        tagsDiv.style.display = 'block';
        tagsDiv.innerHTML = Array.from(checkboxes)
            .map(cb => `<span class="tag">${cb.value}</span>`)
            .join('');
    } else {
        tagsDiv.style.display = 'none';
    }
}

function updateSelectedPins() {
    const checkboxes = document.querySelectorAll('#pinCodes input[type="checkbox"]:checked');
    const tagsDiv = document.getElementById('selectedPinTags');
    
    if (checkboxes.length > 0) {
        tagsDiv.style.display = 'block';
        tagsDiv.innerHTML = Array.from(checkboxes)
            .map(cb => `<span class="tag">${cb.value}</span>`)
            .join('');
    } else {
        tagsDiv.style.display = 'none';
    }
}

// Load Language Data
async function loadLanguageData() {
    loadInlineLanguageData();
    populateLanguages();
}

function loadInlineLanguageData() {
    languagesData = [
        { name: "Hindi", category: "scheduled" },
        { name: "Bengali", category: "scheduled" },
        { name: "Marathi", category: "scheduled" },
        { name: "Telugu", category: "scheduled" },
        { name: "Tamil", category: "scheduled" },
        { name: "Gujarati", category: "scheduled" },
        { name: "Urdu", category: "scheduled" },
        { name: "Kannada", category: "scheduled" },
        { name: "Odia", category: "scheduled" },
        { name: "Malayalam", category: "scheduled" },
        { name: "Punjabi", category: "scheduled" },
        { name: "Assamese", category: "scheduled" },
        { name: "Maithili", category: "scheduled" },
        { name: "Santali", category: "scheduled" },
        { name: "Kashmiri", category: "scheduled" },
        { name: "Nepali", category: "scheduled" },
        { name: "Sindhi", category: "scheduled" },
        { name: "Konkani", category: "scheduled" },
        { name: "Dogri", category: "scheduled" },
        { name: "Manipuri", category: "scheduled" },
        { name: "Bodo", category: "scheduled" },
        { name: "Sanskrit", category: "scheduled" },
        { name: "English", category: "major" },
        { name: "Bhojpuri", category: "major" },
        { name: "Rajasthani", category: "major" },
        { name: "Chhattisgarhi", category: "major" },
        { name: "Haryanvi", category: "major" },
        { name: "Magahi", category: "major" },
        { name: "Marwari", category: "major" },
        { name: "Awadhi", category: "major" },
        { name: "Tulu", category: "regional" },
        { name: "Gondi", category: "regional" },
        { name: "Khasi", category: "regional" },
        { name: "Garo", category: "regional" },
        { name: "Mizo", category: "regional" },
        { name: "Kokborok", category: "regional" }
    ];
}

function populateLanguages() {
    const container = document.getElementById('languages');
    languagesData.sort((a, b) => a.name.localeCompare(b.name));
    
    container.innerHTML = '';
    languagesData.forEach((lang, index) => {
        const item = document.createElement('div');
        item.className = 'checkbox-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `lang-${index}`;
        checkbox.value = lang.name;
        checkbox.name = 'languages';
        checkbox.addEventListener('change', updateSelectedLanguages);
        
        const label = document.createElement('label');
        label.htmlFor = `lang-${index}`;
        label.textContent = lang.name;
        
        item.appendChild(checkbox);
        item.appendChild(label);
        container.appendChild(item);
    });
}

function updateSelectedLanguages() {
    const checkboxes = document.querySelectorAll('#languages input[type="checkbox"]:checked');
    const tagsDiv = document.getElementById('selectedLanguagesTags');
    
    if (checkboxes.length > 0) {
        tagsDiv.style.display = 'block';
        tagsDiv.innerHTML = Array.from(checkboxes)
            .map(cb => `<span class="tag">${cb.value}</span>`)
            .join('');
    } else {
        tagsDiv.style.display = 'none';
    }
}

// Event Listeners
document.getElementById('state').addEventListener('change', function() {
    const selectedState = this.value;
    if (selectedState) {
        populateCities(selectedState);
    } else {
        document.getElementById('city').innerHTML = '<option value="">-- Select State First --</option>';
        document.getElementById('city').disabled = true;
        
        document.getElementById('citySearch').style.display = 'none';
        document.getElementById('cities').innerHTML = '<p style="color: #888; text-align: center;">Select a state first</p>';
        document.getElementById('cities').classList.add('disabled');
        
        document.getElementById('areaSearch').style.display = 'none';
        document.getElementById('areas').innerHTML = '<p style="color: #888; text-align: center;">Select cities first</p>';
        document.getElementById('areas').classList.add('disabled');
        
        document.getElementById('pinSearch').style.display = 'none';
        document.getElementById('pinCodes').innerHTML = '<p style="color: #888; text-align: center;">Select a state first</p>';
        document.getElementById('pinCodes').classList.add('disabled');
        
        document.getElementById('selectedCitiesTags').style.display = 'none';
        document.getElementById('selectedAreasTags').style.display = 'none';
        document.getElementById('selectedPinTags').style.display = 'none';
    }
});

// Search functionality for cities
document.getElementById('citySearch').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const items = document.querySelectorAll('#cities .checkbox-item');
    items.forEach(item => {
        const label = item.querySelector('label');
        const text = label ? label.textContent.toLowerCase() : '';
        item.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Search functionality for areas
document.getElementById('areaSearch').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const items = document.querySelectorAll('#areas .checkbox-item');
    items.forEach(item => {
        const label = item.querySelector('label');
        const text = label ? label.textContent.toLowerCase() : '';
        item.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Search functionality for pin codes
document.getElementById('pinSearch').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const items = document.querySelectorAll('#pinCodes .checkbox-item');
    items.forEach(item => {
        const label = item.querySelector('label');
        const text = label ? label.textContent.toLowerCase() : '';
        item.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Search functionality for languages
document.getElementById('languageSearch').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const items = document.querySelectorAll('#languages .checkbox-item');
    items.forEach(item => {
        const label = item.querySelector('label');
        const text = label ? label.textContent.toLowerCase() : '';
        item.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Storage for all submissions
let registrationData = [];

// Form submit handler
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data with keys matching HTML form field IDs/names
    const formData = {
        Name: document.getElementById('name').value,
        "Date of Birth": document.getElementById('dob').value,
        Gender: document.querySelector('input[name="gender"]:checked')?.value || '',
        "Address Line 1": document.getElementById('address1').value,
        "Address Line 2": document.getElementById('address2').value,
        State: document.getElementById('state').value,
        City: document.getElementById('city').value,
        "Postal Code": document.getElementById('postalCode').value,
        Cities: Array.from(document.querySelectorAll('#cities input[type="checkbox"]:checked')).map(cb => cb.value),
        Areas: Array.from(document.querySelectorAll('#areas input[type="checkbox"]:checked')).map(cb => cb.value),
        "Pin Codes": Array.from(document.querySelectorAll('#pinCodes input[type="checkbox"]:checked')).map(cb => cb.value),
        "Languages Known": Array.from(document.querySelectorAll('#languages input[type="checkbox"]:checked')).map(cb => cb.value),
        Status: document.getElementById('status').value,
        "Onboarding Date": document.getElementById('onboardingDate').value,
        Type: document.getElementById('type').value,
        "Created Date": new Date().toISOString()
    };

    // Add to storage array
    registrationData.push(formData);
    
    // Log the current submission
    console.log('Current Registration Data:', formData);
    
    // Log all submissions
    console.log('All Registrations:', registrationData);
    
    // Download JSON file
    downloadJSON();
    
    // Display success message
    alert('Submitted Successfully!');
});

// Function to download data as JSON file
function downloadJSON() {
    const jsonString = JSON.stringify(registrationData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    
    // Auto-download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Initialize data
loadStateData();
loadLanguageData();