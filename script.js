// State and City Data
let stateData = {};
let pinCodeData = {};
let areaData = {};

// Language Data
let languagesData = [];

// Validation Functions
const validators = {
    name: function(value) {
        if (!value || value.trim() === '') {
            return 'Name is required';
        }
        if (value.trim().length < 2) {
            return 'Name must be at least 2 characters long';
        }
        if (!/^[a-zA-Z\s]+$/.test(value)) {
            return 'Name can only contain letters and spaces';
        }
        return '';
    },

    dateOfBirth: function(value) {
        if (!value) {
            return 'Date of birth is required';
        }
        
        const selectedDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - selectedDate.getFullYear();
        const monthDiff = today.getMonth() - selectedDate.getMonth();
        
        let actualAge = age;
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
            actualAge--;
        }
        
        if (actualAge >= 18) {
            return 'Age must be less than 18 years';
        }
        
        if (selectedDate > today) {
            return 'Date of birth cannot be in the future';
        }
        
        return '';
    },

    gender: function() {
        const selected = document.querySelector('input[name="gender"]:checked');
        if (!selected) {
            return 'Please select a gender';
        }
        return '';
    },

    addressLine1: function(value) {
        if (!value || value.trim() === '') {
            return 'Address Line 1 is required';
        }
        if (value.trim().length < 5) {
            return 'Address must be at least 5 characters long';
        }
        return '';
    },

    addressLine2: function(value) {
        // Optional field, no validation needed
        return '';
    },

    state: function(value) {
        if (!value || value === '') {
            return 'Please select a state';
        }
        return '';
    },

    city: function(value) {
        if (!value || value === '') {
            return 'Please select a city';
        }
        return '';
    },

    postalCode: function(value) {
        if (!value || value.trim() === '') {
            return 'Postal code is required';
        }
        if (!/^[0-9]{6}$/.test(value)) {
            return 'Postal code must be exactly 6 digits';
        }
        return '';
    },

    status: function(value) {
        if (!value || value === '') {
            return 'Please select a status';
        }
        return '';
    },

    onboardingDate: function(value) {
        if (!value) {
            return 'Onboarding date is required';
        }
        
        const selectedDate = new Date(value);
        const today = new Date();
        
        if (selectedDate > today) {
            return 'Onboarding date cannot be in the future';
        }
        
        return '';
    },

    type: function(value) {
        if (!value || value === '') {
            return 'Please select a type';
        }
        return '';
    }
};

// Show error message
function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);
    const formGroup = inputElement?.closest('.form-group');
    
    if (errorElement) {
        errorElement.textContent = message;
    }
    
    if (inputElement) {
        inputElement.classList.add('error');
        inputElement.classList.remove('success');
    }
    
    if (formGroup) {
        formGroup.classList.add('invalid');
        formGroup.classList.remove('valid');
    }
    
    // Special handling for radio buttons
    if (fieldId === 'gender') {
        const radioGroup = document.querySelector('.radio-group');
        if (radioGroup) {
            radioGroup.classList.add('error');
        }
    }
}

// Clear error message
function clearError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    const inputElement = document.getElementById(fieldId);
    const formGroup = inputElement?.closest('.form-group');
    
    if (errorElement) {
        errorElement.textContent = '';
    }
    
    if (inputElement) {
        inputElement.classList.remove('error');
        inputElement.classList.add('success');
    }
    
    if (formGroup) {
        formGroup.classList.remove('invalid');
        formGroup.classList.add('valid');
    }
    
    // Special handling for radio buttons
    if (fieldId === 'gender') {
        const radioGroup = document.querySelector('.radio-group');
        if (radioGroup) {
            radioGroup.classList.remove('error');
        }
    }
}

// Validate single field
function validateField(fieldId) {
    let value;
    
    if (fieldId === 'gender') {
        value = document.querySelector('input[name="gender"]:checked')?.value;
    } else {
        const field = document.getElementById(fieldId);
        value = field ? field.value : '';
    }
    
    const error = validators[fieldId] ? validators[fieldId](value) : '';
    
    if (error) {
        showError(fieldId, error);
        return false;
    } else {
        clearError(fieldId);
        return true;
    }
}

// Validate all fields
function validateForm() {
    let isValid = true;
    
    const requiredFields = [
        'name',
        'dateOfBirth',
        'gender',
        'addressLine1',
        'state',
        'city',
        'postalCode',
        'status',
        'onboardingDate',
        'type'
    ];
    
    requiredFields.forEach(fieldId => {
        if (!validateField(fieldId)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Add real-time validation listeners
function setupValidationListeners() {
    // Text inputs and selects
    const fields = ['name', 'dateOfBirth', 'addressLine1', 'addressLine2', 'state', 'city', 'postalCode', 'status', 'onboardingDate', 'type'];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            // Validate on blur (when user leaves the field)
            field.addEventListener('blur', function() {
                validateField(fieldId);
            });
            
            // Clear error on input (when user starts typing)
            field.addEventListener('input', function() {
                const errorElement = document.getElementById(`${fieldId}-error`);
                if (errorElement && errorElement.textContent) {
                    validateField(fieldId);
                }
            });
        }
    });
    
    // Radio buttons
    document.querySelectorAll('input[name="gender"]').forEach(radio => {
        radio.addEventListener('change', function() {
            validateField('gender');
        });
    });
}

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
    const cities = stateData[state] || [];
    
    citySelect.innerHTML = '<option value="">-- Select City --</option>';
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
    citySelect.disabled = false;
    
    // Clear city validation when state changes
    clearError('city');
    
    // Populate multiple cities
    populateMultipleCities(state);
    
    // Populate pin codes
    populatePinCodes(state);
}

function populateMultipleCities(state) {
    const container = document.getElementById('cities');
    const searchBox = document.getElementById('citySearch');
    const cities = stateData[state] || [];
    
    searchBox.value = '';
    container.classList.remove('disabled');
    container.innerHTML = '';
    
    cities.forEach((city, index) => {
        const item = document.createElement('div');
        item.className = 'checkbox-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `city-multi-${index}`;
        checkbox.value = city;
        checkbox.name = 'cities';
        checkbox.addEventListener('change', function() {
            updateSelectedCities();
            updateAreas();
        });
        
        const label = document.createElement('label');
        label.htmlFor = `city-multi-${index}`;
        label.textContent = city;
        
        item.appendChild(checkbox);
        item.appendChild(label);
        container.appendChild(item);
    });
}

function populatePinCodes(state) {
    const container = document.getElementById('pinCodesMultiple');
    const searchBox = document.getElementById('pinSearch');
    const pinCodes = pinCodeData[state] || [];
    
    searchBox.value = '';
    container.classList.remove('disabled');
    container.innerHTML = '';
    
    pinCodes.forEach((pin, index) => {
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
        container.classList.add('disabled');
        container.innerHTML = '<p style="color: #888; text-align: center;">Select cities first</p>';
        document.getElementById('selectedAreasTags').style.display = 'none';
        return;
    }
    
    // Collect all areas from selected cities
    const allAreas = [];
    selectedCities.forEach(city => {
        if (areaData[city]) {
            areaData[city].forEach(area => {
                allAreas.push({ city, area });
            });
        }
    });
    
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
    const checkboxes = document.querySelectorAll('#pinCodesMultiple input[type="checkbox"]:checked');
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
    const container = document.getElementById('languagesKnown');
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
    const checkboxes = document.querySelectorAll('#languagesKnown input[type="checkbox"]:checked');
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
        validateField('state');
    } else {
        document.getElementById('city').innerHTML = '<option value="">-- Select State First --</option>';
        document.getElementById('city').disabled = true;
        
        document.getElementById('cities').innerHTML = '<p style="color: #888; text-align: center;">Select a state first</p>';
        document.getElementById('cities').classList.add('disabled');
        
        document.getElementById('areas').innerHTML = '<p style="color: #888; text-align: center;">Select cities first</p>';
        document.getElementById('areas').classList.add('disabled');
        
        document.getElementById('pinCodesMultiple').innerHTML = '<p style="color: #888; text-align: center;">Select a state first</p>';
        document.getElementById('pinCodesMultiple').classList.add('disabled');
        
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
    const items = document.querySelectorAll('#pinCodesMultiple .checkbox-item');
    items.forEach(item => {
        const label = item.querySelector('label');
        const text = label ? label.textContent.toLowerCase() : '';
        item.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Search functionality for languages
document.getElementById('languageSearch').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const items = document.querySelectorAll('#languagesKnown .checkbox-item');
    items.forEach(item => {
        const label = item.querySelector('label');
        const text = label ? label.textContent.toLowerCase() : '';
        item.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Storage for all submissions
let registrationData = [];

// Load existing data from localStorage on page load
function loadExistingData() {
    const savedData = localStorage.getItem('registrationData');
    if (savedData) {
        registrationData = JSON.parse(savedData);
        console.log('Loaded existing registrations:', registrationData);
    }
}

// Function to save data to localStorage
function saveToLocalStorage() {
    localStorage.setItem('registrationData', JSON.stringify(registrationData));
    console.log('Data saved to localStorage');
    console.log('Total registrations:', registrationData.length);
}

// Form submit handler
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate all fields
    if (!validateForm()) {
        alert('Please fix all errors before submitting');
        // Scroll to first error
        const firstError = document.querySelector('.error-message:not(:empty)');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // Collect form data with matching JSON keys and field names
    const formData = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        name: document.getElementById('name').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        gender: document.querySelector('input[name="gender"]:checked')?.value || '',
        addressLine1: document.getElementById('addressLine1').value,
        addressLine2: document.getElementById('addressLine2').value,
        state: document.getElementById('state').value,
        city: document.getElementById('city').value,
        postalCode: document.getElementById('postalCode').value,
        cities: Array.from(document.querySelectorAll('#cities input[type="checkbox"]:checked')).map(cb => cb.value),
        areas: Array.from(document.querySelectorAll('#areas input[type="checkbox"]:checked')).map(cb => cb.value),
        pinCodes: Array.from(document.querySelectorAll('#pinCodesMultiple input[type="checkbox"]:checked')).map(cb => cb.value),
        languages: Array.from(document.querySelectorAll('#languagesKnown input[type="checkbox"]:checked')).map(cb => cb.value),
        status: document.getElementById('status').value,
        onboardingDate: document.getElementById('onboardingDate').value,
        type: document.getElementById('type').value
    };

    // Add to storage array
    registrationData.push(formData);
    
    // Save to localStorage (this feeds the dashboard)
    saveToLocalStorage();
    
    // Log the current submission
    console.log('Current Registration Data:', formData);
    
    // Log all submissions
    console.log('All Registrations:', registrationData);
    
    // Display success message with option to view dashboard
    if (confirm('Submitted Successfully! Data has been saved to the dashboard.\n\nWould you like to view the dashboard now?')) {
        window.location.href = 'dashboard.html';
    } else {
        // Optionally reset the form after submission
        if (confirm('Would you like to register another user?')) {
            document.getElementById('registrationForm').reset();
            // Clear all validation states
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            document.querySelectorAll('input, select').forEach(el => {
                el.classList.remove('error', 'success');
            });
            document.querySelectorAll('.form-group').forEach(el => {
                el.classList.remove('valid', 'invalid');
            });
            // Reset dynamic fields
            document.getElementById('city').disabled = true;
            document.getElementById('cities').innerHTML = '<p style="color: #888; text-align: center;">Select a state first</p>';
            document.getElementById('cities').classList.add('disabled');
            document.getElementById('areas').innerHTML = '<p style="color: #888; text-align: center;">Select cities first</p>';
            document.getElementById('areas').classList.add('disabled');
            document.getElementById('selectedCitiesTags').style.display = 'none';
            document.getElementById('selectedAreasTags').style.display = 'none';
            document.getElementById('selectedPinTags').style.display = 'none';
            document.getElementById('selectedLanguagesTags').style.display = 'none';
        }
    }
});

// Load existing data when page loads
loadExistingData();

// Initialize data
loadStateData();
loadLanguageData();

// Setup validation listeners
setupValidationListeners();

// Menu Toggle for Sidebar
document.getElementById('menuToggle').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
});