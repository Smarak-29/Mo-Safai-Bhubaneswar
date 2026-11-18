// Mo Safai Bhubaneswar - Bilingual i18n Engine (English & Odia)
const translations = {
  en: {
    app_title: "Mo Safai Bhubaneswar",
    bmc_subtitle: "Bhubaneswar Municipal Corporation",
    app_tagline: "AI Smart Waste Management & Citizen Credits",
    
    // Navigation
    nav_scanner: "Smart Scanner",
    nav_map: "City Map",
    nav_account: "Citizen Account",
    nav_login: "Sign In",
    nav_register: "Register",
    nav_logout: "Sign Out",
    nav_credits: "Green Credits",
    
    // Auth - Login
    login_title: "Citizen Sign In",
    login_desc: "Access your BMC ward waste services and Green Credits",
    demo_btn: "⚡ One-Click Demo Citizen Login",
    demo_subtext: "Instant access as Smarak (Ward 1 - Patia, 120 Green Credits)",
    email_label: "Email Address",
    email_placeholder: "citizen@bhubaneswar.gov.in",
    password_label: "Password",
    password_placeholder: "••••••••",
    sign_in_btn: "Sign In to Mo Safai",
    no_account: "New citizen in Bhubaneswar?",
    register_link: "Create an account",
    
    // Auth - Register
    register_title: "Citizen Registration",
    register_desc: "Join Bhubaneswar's clean city mission and earn civic rewards",
    name_label: "Full Name",
    name_placeholder: "e.g. Smarak Mohapatra",
    ward_select_label: "Select Your BMC Ward",
    create_account_btn: "Complete Registration",
    already_account: "Already registered?",
    sign_in_link: "Sign In here",
    
    // Account & Preferences
    account_title: "Citizen Account & Preferences",
    account_desc: "Manage your civic profile, residential ward, and AI voice assistance",
    profile_summary: "Citizen Profile",
    verified_badge: "Verified BMC Citizen",
    current_credits: "Green Credits Balance",
    credits_unit: "Credits",
    credits_earned_info: "Earned via segregated waste disposal & timely civic reporting",
    tier_badge: "Mo Khata Citizen Tier 1",
    settings_heading: "Application Preferences",
    pref_ward_label: "Assigned BMC Ward",
    pref_ward_desc: "Prioritizes your local sanitation alerts and nearby smart bins",
    pref_lang_label: "Default Language",
    pref_lang_desc: "Choose between English and Odia for all interfaces and AI guidance",
    pref_voice_label: "Auto-Voice Readout",
    pref_voice_desc: "Automatically read waste segregation instructions aloud when scanned",
    voice_enabled_status: "Active (Voice speaks segregation instructions)",
    voice_disabled_status: "Muted (Silent on-screen display only)",
    save_changes_btn: "Save Preferences",
    saving_btn: "Saving...",
    save_success_toast: "Preferences saved successfully to BMC records!",
    logout_confirm: "Are you sure you want to log out?",
    
    // Wards
    ward_1: "Ward 1 - Patia",
    ward_26: "Ward 26 - Jaydev Vihar",
    ward_27: "Ward 27 - Saheed Nagar",
    ward_39: "Ward 39 - Old Town / Lingaraj",
    ward_47: "Ward 47 - Bapuji Nagar",
    ward_49: "Ward 49 - Khandagiri",
    
    // City Map & Municipal Command (Stage 3)
    map_title: "Municipal Command Map",
    map_desc: "Dual-stream sanitation truck route optimizer & real-time telemetry grid",
    stream_wet: "Wet (Organic)",
    stream_dry: "Dry (Recyclable)",
    status_normal: "Normal (<50%)",
    status_filling: "Filling (50-80%)",
    status_critical: "Critical (>80%)",
    filter_all: "All Wards",
    bin_level: "Fill Level",
    bin_last_update: "Updated",
    just_now: "Just now",
    
    // Stage 3 Route Optimization & Controls
    btn_simulate_spike: "⚡ Simulate Overflow Spike",
    btn_reset_bins: "Reset Bins",
    btn_optimize_routes: "🚛 Optimize Truck Routes",
    optimizing_label: "Calculating optimal routes...",
    zone_filter_label: "BMC Zone:",
    zone_all: "All Zones",
    zone_north: "North Zone",
    zone_southeast: "South-East Zone",
    zone_southwest: "South-West Zone",
    facility_mcc_title: "Niladri Vihar MCC (Mo Khata Unit)",
    facility_mrf_title: "Pokhariput MRF Facility",
    facility_mcc_desc: "Wet organic composting & bio-fertilizer processing unit",
    facility_mrf_desc: "Dry recyclable recovery & baling facility",
    metric_critical_bins: "Critical Bins Flagged",
    metric_optimized_dist: "Optimized Distance",
    metric_savings: "Fuel & CO₂ Saved",
    metric_compost_yield: "Mo Khata Compost Yield",
    route_wet_heading: "🟢 Wet Waste Stream -> Niladri Vihar MCC",
    route_dry_heading: "🔵 Dry Waste Stream -> Pokhariput MRF",
    driver_manifest: "Driver Manifest & Turn-by-Turn Stops",
    stop_label: "Stop",
    destination_facility: "Destination Facility",
    live_tickets_feed: "Live BMC 1929 Citizen Tickets",
    no_tickets_yet: "No active overflow tickets recorded.",
    status_dispatched: "DISPATCHED",
    toast_spike_simulated: "Overflow spike simulated! 3-4 bins surged to critical levels.",
    toast_bins_reset: "All smart bins successfully reset to normal levels.",
    toast_route_calculated: "Dual-stream routes optimized successfully!",
    no_critical_bins_msg: "No critical bins (>80%) currently flagged. Grid is operating within normal limits.",
    
    // Smart AI Scanner (Stage 2)
    scanner_heading: "AI Smart Waste Scanner",
    scanner_subheading: "Point camera or upload a waste photo for instant Gemini Vision classification & BMC 1929 grievance logging",
    upload_box_title: "Take Photo or Upload Waste Image",
    upload_box_desc: "Tap anywhere to snap with camera or choose from gallery",
    change_photo_btn: "Change Photo",
    quick_samples_title: "⚡ Quick Demo Samples (Instant 1-Click AI Test):",
    sample_wet_btn: "🥗 Wet Waste (Peels)",
    sample_overflow_btn: "🚨 Overflowing Bin (1929 Ticket)",
    sample_temple_btn: "🌸 Temple Flowers (Nirmalya)",
    sample_dry_btn: "🥤 Dry Recyclable (Plastic)",
    scan_analyze_btn: "Analyze Waste with BMC AI",
    scanning_loader: "Analyzing waste with Gemini Vision...",
    listen_odia_btn: "🔊 Listen in Odia / ଓଡ଼ିଆରେ ଶୁଣନ୍ତୁ",
    speaking_label: "🔊 Speaking Odia guidance...",
    stop_audio_btn: "⏹️ Stop Audio",
    official_ticket_badge: "Official BMC 1929 Grievance Ticket Logged",
    ticket_desc_text: "High priority sanitation truck dispatch alert transmitted to BMC Sanitation Control Room.",
    ticket_id_label: "Grievance Ticket ID",
    drain_risk_badge: "⚠️ Monsoon Flood Risk: Plastic waste located near drainage channel. Flagged for priority desilting.",
    recommended_bin_label: "Recommended Bin",
    guidance_label: "Disposal Guidance",
    confidence_metric: "AI Confidence",
    credits_awarded_label: "Green Credits Awarded",
    recent_history_title: "Recent Scans & 1929 Tickets",
    no_history_text: "No waste scans yet. Snap your first waste photo above!",
    
    // Footer / Mobile
    mobile_quick_scan: "Scan Waste",
    mobile_live_bins: "City Map",
    mobile_profile: "Account"
  },
  
  or: {
    app_title: "ମୋ ସଫେଇ ଭୁବନେଶ୍ୱର",
    bmc_subtitle: "ଭୁବନେଶ୍ୱର ମହାନଗର ନିଗମ",
    app_tagline: "ଏଆଇ ସ୍ମାର୍ଟ ବର୍ଜ୍ୟବସ୍ତୁ ପୃଥକୀକରଣ ଓ ନାଗରିକ କ୍ରେଡିଟ୍",
    
    // Navigation
    nav_scanner: "ସ୍ମାର୍ଟ ସ୍କାନର",
    nav_map: "ନଗର ମାନଚିତ୍ର",
    nav_account: "ନାଗରିକ ଖାତା",
    nav_login: "ଲଗଇନ୍",
    nav_register: "ପଞ୍ଜୀକରଣ",
    nav_logout: "ଲଗ୍ ଆଉଟ୍",
    nav_credits: "ସବୁଜ କ୍ରେଡିଟ୍",
    
    // Auth - Login
    login_title: "ନାଗରିକ ଲଗଇନ୍",
    login_desc: "ଆପଣଙ୍କ ବିଏମସି ୱାର୍ଡର ସଫେଇ ସେବା ଏବଂ ସବୁଜ କ୍ରେଡିଟ୍ ପାଇଁ ପ୍ରବେଶ କରନ୍ତୁ",
    demo_btn: "⚡ ଏକ-କ୍ଲିକ୍ ଡେମୋ ନାଗରିକ ଲଗଇନ୍",
    demo_subtext: "ସ୍ମାରକ (ୱାର୍ଡ ୧ - ପଟିଆ, ୧୨୦ ସବୁଜ କ୍ରେଡିଟ୍) ଭାବେ ତୁରନ୍ତ ପ୍ରବେଶ କରନ୍ତୁ",
    email_label: "ଇମେଲ୍ ଠିକଣା",
    email_placeholder: "citizen@bhubaneswar.gov.in",
    password_label: "ଗୁପ୍ତଶବ୍ଦ (ପାସୱାର୍ଡ)",
    password_placeholder: "••••••••",
    sign_in_btn: "ମୋ ସଫେଇରେ ଲଗଇନ୍ କରନ୍ତୁ",
    no_account: "ଭୁବନେଶ୍ୱରର ନୂତନ ନାଗରିକ କି?",
    register_link: "ଏକ ଖାତା ଖୋଲନ୍ତୁ",
    
    // Auth - Register
    register_title: "ନୂତନ ନାଗରିକ ପଞ୍ଜୀକରଣ",
    register_desc: "ଭୁବନେଶ୍ୱର ସ୍ୱଚ୍ଛତା ମିଶନରେ ସାମିଲ ହୁଅନ୍ତୁ ଏବଂ ନାଗରିକ ପୁରସ୍କାର ପାଆନ୍ତୁ",
    name_label: "ସମ୍ପୂର୍ଣ୍ଣ ନାମ",
    name_placeholder: "ଉଦାହରଣ: ସ୍ମାରକ ମହାପାତ୍ର",
    ward_select_label: "ଆପଣଙ୍କ ବିଏମସି (BMC) ୱାର୍ଡ ଚୟନ କରନ୍ତୁ",
    create_account_btn: "ପଞ୍ଜୀକରଣ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ",
    already_account: "ପୂର୍ବରୁ ପଞ୍ଜୀକୃତ ଅଛନ୍ତି କି?",
    sign_in_link: "ଏଠାରେ ଲଗଇନ୍ କରନ୍ତୁ",
    
    // Account & Preferences
    account_title: "ନାଗରିକ ଖାତା ଓ ସେଟିଙ୍ଗସ୍",
    account_desc: "ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍, ବାସସ୍ଥାନ ୱାର୍ଡ ଏବଂ ଏଆଇ ସ୍ୱର ସହାୟତା ପରିଚାଳନା କରନ୍ତୁ",
    profile_summary: "ନାଗରିକ ପରିଚୟ",
    verified_badge: "ପ୍ରମାଣିତ ବିଏମସି ନାଗରିକ",
    current_credits: "ମୋଟ ସବୁଜ କ୍ରେଡିଟ୍ ବାଲାନ୍ସ",
    credits_unit: "କ୍ରେଡିଟ୍",
    credits_earned_info: "ପୃଥକ୍ ବର୍ଜ୍ୟ ପରିତ୍ୟାଗ ଓ ନିୟମିତ ନାଗରିକ ରିପୋର୍ଟ ମାଧ୍ୟମରେ ଅର୍ଜିତ",
    tier_badge: "ମୋ ଖାତା ନାଗରିକ ସ୍ତର ୧",
    settings_heading: "ଆପ୍ଲିକେସନ୍ ପସନ୍ଦ ଓ ସେଟିଙ୍ଗସ୍",
    pref_ward_label: "ନିର୍ଦ୍ଦିଷ୍ଟ ବିଏମସି ୱାର୍ଡ",
    pref_ward_desc: "ଆପଣଙ୍କ ଅଞ୍ଚଳର ସଫେଇ ସୂଚନା ଏବଂ ନିକଟସ୍ଥ ସ୍ମାର୍ଟ ଡଷ୍ଟବିନ୍ ଦେଖାଏ",
    pref_lang_label: "ପ୍ରାଥମିକ ଭାଷା",
    pref_lang_desc: "ସମସ୍ତ ସୂଚନା ଏବଂ ଏଆଇ ନିର୍ଦ୍ଦେଶ ପାଇଁ ଇଂରାଜୀ କିମ୍ବା ଓଡ଼ିଆ ବାଛନ୍ତୁ",
    pref_voice_label: "ସ୍ୱୟଂଚାଳିତ ଭଏସ୍ ଶୁଣାଣି",
    pref_voice_desc: "ଆବର୍ଜନା ସ୍କାନ୍ କରିବା ମାତ୍ରେ ପୃଥକୀକରଣ ନିର୍ଦ୍ଦେଶକୁ ସ୍ୱର ମାଧ୍ୟମରେ ଶୁଣାନ୍ତୁ",
    voice_enabled_status: "ସକ୍ରିୟ (ଭଏସ୍ ସହାୟତା ଅନ୍ ଅଛି)",
    voice_disabled_status: "ନିରବ (କେବଳ ସ୍କ୍ରିନରେ ଲେଖା ଦେଖାଯିବ)",
    save_changes_btn: "ପସନ୍ଦ ସଂରକ୍ଷଣ କରନ୍ତୁ",
    saving_btn: "ସଂରକ୍ଷିତ ହେଉଛି...",
    save_success_toast: "ଆପଣଙ୍କ ପସନ୍ଦ ବିଏମସି ରେକର୍ଡରେ ସଫଳତାର ସହ ସଂରକ୍ଷିତ ହେଲା!",
    logout_confirm: "ଆପଣ ପ୍ରକୃତରେ ଲଗ୍ ଆଉଟ୍ କରିବାକୁ ଚାହୁଁଛନ୍ତି କି?",
    
    // Wards
    ward_1: "ୱାର୍ଡ ୧ - ପଟିଆ",
    ward_26: "ୱାର୍ଡ ୨୬ - ଜୟଦେବ ବିହାର",
    ward_27: "ୱାର୍ଡ ୨୭ - ସହିଦ ନଗର",
    ward_39: "ୱାର୍ଡ ୩୯ - ପୁରୁଣା ସହର / ଲିଙ୍ଗରାଜ",
    ward_47: "ୱାର୍ଡ ୪୭ - ବାପୁଜୀ ନଗର",
    ward_49: "ୱାର୍ଡ ୪୯ - ଖଣ୍ଡଗିରି",
    
    // City Map & Municipal Command (Stage 3)
    map_title: "ମ୍ୟୁନିସିପାଲ୍ କମାଣ୍ଡ୍ ମାନଚିତ୍ର",
    map_desc: "ଉଭୟ ସଫେଇ ଗାଡ଼ି ରୁଟ୍ ଅପ୍ଟିମାଇଜର ଓ ରିଅଲ-ଟାଇମ୍ ଡଷ୍ଟବିନ୍ ମନିଟରିଂ",
    stream_wet: "ଓଦା (ଜୈବିକ ବର୍ଜ୍ୟ)",
    stream_dry: "ଶୁଖିଲା (ପୁନଃଚକ୍ରଣ ଯୋଗ୍ୟ)",
    status_normal: "ସ୍ୱାଭାବିକ (<୫୦%)",
    status_filling: "ଭରୁଛି (୫୦-୮୦%)",
    status_critical: "ସଙ୍କଟଜନକ (>୮୦%)",
    filter_all: "ସମସ୍ତ ୱାର୍ଡ",
    bin_level: "ଭର୍ତ୍ତି ସ୍ତର",
    bin_last_update: "ଅପଡେଟ୍ ହେଲା",
    just_now: "ଏଇ ମାତ୍ର",
    
    // Stage 3 Route Optimization & Controls
    btn_simulate_spike: "⚡ ଅତିରିକ୍ତ ଅଳିଆ ସ୍ଥିତି (ସ୍ପାଇକ୍)",
    btn_reset_bins: "ଡଷ୍ଟବିନ୍ ରିସେଟ୍",
    btn_optimize_routes: "🚛 ସଫେଇ ଗାଡ଼ି ରୁଟ୍ ନିର୍ଣ୍ଣୟ",
    optimizing_label: "ଉପଯୁକ୍ତ ରୁଟ୍ ଗଣନା ଚାଲିଛି...",
    zone_filter_label: "ବିଏମସି ଜୋନ୍:",
    zone_all: "ସମସ୍ତ ଜୋନ୍",
    zone_north: "ଉତ୍ତର ଜୋନ୍",
    zone_southeast: "ଦକ୍ଷିଣ-ପୂର୍ବ ଜୋନ୍",
    zone_southwest: "ଦକ୍ଷିଣ-ପଶ୍ଚିମ ଜୋନ୍",
    facility_mcc_title: "ନୀଳାଦ୍ରି ବିହାର ଏମସିସି (ମୋ ଖାତା କେନ୍ଦ୍ର)",
    facility_mrf_title: "ପୋଖରୀପୁଟ ଏମଆରଏଫ (ପୁନରୁଦ୍ଧାର କେନ୍ଦ୍ର)",
    facility_mcc_desc: "ଓଦା ଜୈବିକ ଖତ ପ୍ରସ୍ତୁତି କେନ୍ଦ୍ର",
    facility_mrf_desc: "ଶୁଖିଲା ପୁନଃଚକ୍ରଣ ଯୋଗ୍ୟ ବର୍ଜ୍ୟ ପୁନରୁଦ୍ଧାର କେନ୍ଦ୍ର",
    metric_critical_bins: "ସଙ୍କଟଜନକ ଡଷ୍ଟବିନ୍",
    metric_optimized_dist: "ଅପ୍ଟିମାଇଜ୍ଡ ରୁଟ୍ ଦୂରତା",
    metric_savings: "ଇନ୍ଧନ ଓ କାର୍ବନ ସଞ୍ଚୟ",
    metric_compost_yield: "ମୋ ଖାତା ଜୈବିକ ଖତ ଉତ୍ପାଦନ",
    route_wet_heading: "🟢 ଓଦା ବର୍ଜ୍ୟ ରୁଟ୍ -> ନୀଳାଦ୍ରି ବିହାର ଏମସିସି",
    route_dry_heading: "🔵 ଶୁଖିଲା ବର୍ଜ୍ୟ ରୁଟ୍ -> ପୋଖରୀପୁଟ ଏମଆରଏଫ",
    driver_manifest: "ଚାଳକଙ୍କ ପାଇଁ ପର୍ଯ୍ୟାୟକ୍ରମିକ ଷ୍ଟପ୍ ତାଲିକା",
    stop_label: "ଷ୍ଟପ୍",
    destination_facility: "ଗନ୍ତବ୍ୟ କେନ୍ଦ୍ର",
    live_tickets_feed: "ଲାଇଭ୍ ବିଏମସି ୧୯୨୯ ନାଗରିକ ଅଭିଯୋଗ",
    no_tickets_yet: "କୌଣସି ସକ୍ରିୟ ଅଭିଯୋଗ ଟିକେଟ୍ ନାହିଁ।",
    status_dispatched: "ଗାଡ଼ି ପଠାଗଲା",
    toast_spike_simulated: "ଅତିରିକ୍ତ ଅଳିଆ ସ୍ଥିତି ସୃଷ୍ଟି ହେଲା! ୩-୪ଟି ଡଷ୍ଟବିନ୍ ସଙ୍କଟଜନକ ସ୍ତରକୁ ଆସିଲା।",
    toast_bins_reset: "ସମସ୍ତ ସ୍ମାର୍ଟ ଡଷ୍ଟବିନ୍ ସ୍ୱାଭାବିକ ସ୍ତରକୁ ଫେରିଆସିଲା।",
    toast_route_calculated: "ଉଭୟ ସଫେଇ ରୁଟ୍ ସଫଳତାର ସହ ପ୍ରସ୍ତୁତ ହେଲା!",
    no_critical_bins_msg: "ବର୍ତ୍ତମାନ କୌଣସି ଡଷ୍ଟବିନ୍ ସଙ୍କଟଜନକ (>୮୦%) ନାହିଁ। ସମସ୍ତ ସ୍ଥିତି ସ୍ୱାଭାବିକ ଅଛି।",
    
    // Smart AI Scanner (Stage 2)
    scanner_heading: "ଏଆଇ ସ୍ମାର୍ଟ ବର୍ଜ୍ୟବସ୍ତୁ ସ୍କାନର",
    scanner_subheading: "ତୁରନ୍ତ ଏଆଇ ପୃଥକୀକରଣ ଓ ବିଏମସି ୧୯୨୯ ଅଭିଯୋଗ ପାଇଁ ଫଟୋ ଉଠାନ୍ତୁ ବା ଅପଲୋଡ୍ କରନ୍ତୁ",
    upload_box_title: "ଫଟୋ ଉଠାନ୍ତୁ ବା ଇମେଜ୍ ଅପଲୋଡ୍ କରନ୍ତୁ",
    upload_box_desc: "ଫଟୋ ଉଠାଇବା ପାଇଁ ବା ଗ୍ୟାଲେରୀରୁ ବାଛିବା ପାଇଁ ଏଠାରେ ଟ୍ୟାପ୍ କରନ୍ତୁ",
    change_photo_btn: "ଫଟୋ ବଦଳାନ୍ତୁ",
    quick_samples_title: "⚡ ଶୀଘ୍ର ଡେମୋ ନମୁନା (ତୁରନ୍ତ ଏଆଇ ପରୀକ୍ଷା):",
    sample_wet_btn: "🥗 ଓଦା ବର୍ଜ୍ୟ (ପନିପରିବା ଚୋପା)",
    sample_overflow_btn: "🚨 ଉଛୁଳୁଥିବା ଡଷ୍ଟବିନ୍ (୧୯୨୯ ଟିକେଟ୍)",
    sample_temple_btn: "🌸 ମନ୍ଦିର ନିର୍ମାଲ୍ୟ ଫୁଲ",
    sample_dry_btn: "🥤 ଶୁଖିଲା ପୁନଃଚକ୍ରଣ (ପ୍ଲାଷ୍ଟିକ୍)",
    scan_analyze_btn: "ବିଏମସି ଏଆଇ ଦ୍ୱାରା ବିଶ୍ଳେଷଣ କରନ୍ତୁ",
    scanning_loader: "ଜେମିନି ଭିଜନ ଦ୍ୱାରା ବର୍ଜ୍ୟ ବିଶ୍ଳେଷଣ ଚାଲିଛି...",
    listen_odia_btn: "🔊 ଓଡ଼ିଆରେ ଶୁଣନ୍ତୁ",
    speaking_label: "🔊 ଓଡ଼ିଆରେ ଶୁଣାଯାଉଛି...",
    stop_audio_btn: "⏹️ ଅଡିଓ ବନ୍ଦ କରନ୍ତୁ",
    official_ticket_badge: "ଅଫିସିଆଲ ବିଏମସି ୧୯୨୯ ଅଭିଯୋଗ ଟିକେଟ୍ ଦାଖଲ ହେଲା",
    ticket_desc_text: "ବିଏମସି ସଫେଇ ନିୟନ୍ତ୍ରଣ କକ୍ଷକୁ ଜରୁରୀ ସଫେଇ ଗାଡ଼ି ପଠାଇବା ପାଇଁ ସୂଚନା ଦିଆଗଲା।",
    ticket_id_label: "ଅଭିଯୋଗ ଟିକେଟ୍ ନମ୍ବର",
    drain_risk_badge: "⚠️ ବର୍ଷାଜଳ ଜମିବା ବିପଦ: ନାଳ ନିକଟରେ ପ୍ଲାଷ୍ଟିକ୍ ଥିବାରୁ ଜରୁରୀ ଭିତ୍ତିରେ ସଫେଇ ପାଇଁ ଚିହ୍ନଟ।",
    recommended_bin_label: "ନିର୍ଦ୍ଦିଷ୍ଟ ଡଷ୍ଟବିନ୍",
    guidance_label: "ପରିତ୍ୟାଗ ନିର୍ଦ୍ଦେଶ",
    confidence_metric: "ଏଆଇ ନିର୍ଭୁଲତା ସ୍ତର",
    credits_awarded_label: "ସବୁଜ କ୍ରେଡିଟ୍ ପ୍ରଦାନ କରାଗଲା",
    recent_history_title: "ସମ୍ପ୍ରତି ସ୍କାନ୍ ଓ ୧୯୨୯ ଟିକେଟ୍ ତାଲିକା",
    no_history_text: "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ସ୍କାନ୍ ହୋଇନାହିଁ। ଉପରେ ଫଟୋ ଉଠାନ୍ତୁ!",
    
    // Footer / Mobile
    mobile_quick_scan: "ସ୍କାନ୍ କରନ୍ତୁ",
    mobile_live_bins: "ମାନଚିତ୍ର",
    mobile_profile: "ଖାତା"
  }
};

let currentLanguage = 'en';

function setLanguage(lang) {
  if (lang !== 'en' && lang !== 'or') lang = 'en';
  currentLanguage = lang;
  localStorage.setItem('mo_safai_lang', lang);
  document.documentElement.lang = lang;
  
  if (lang === 'or') {
    document.body.classList.add('font-odia');
  } else {
    document.body.classList.remove('font-odia');
  }

  // Update text elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Update input placeholders with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  // Update option values or labels with data-i18n
  document.querySelectorAll('option[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Update language toggle buttons visual state
  updateToggleButtons(lang);
}

function updateToggleButtons(lang) {
  const enBtn = document.getElementById('lang-btn-en');
  const orBtn = document.getElementById('lang-btn-or');
  
  if (enBtn && orBtn) {
    if (lang === 'en') {
      enBtn.className = "px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-700 text-white shadow-sm transition-all";
      orBtn.className = "px-2.5 py-1 text-xs font-medium rounded-full text-slate-600 hover:text-slate-900 transition-all";
    } else {
      enBtn.className = "px-2.5 py-1 text-xs font-medium rounded-full text-slate-600 hover:text-slate-900 transition-all";
      orBtn.className = "px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-700 text-white shadow-sm transition-all";
    }
  }

  // Also sync select if present on account page
  const langSelect = document.getElementById('languageSelect');
  if (langSelect && langSelect.value !== lang) {
    langSelect.value = lang;
  }
}

// Global switch function for onclick handlers
window.switchLanguage = function(lang) {
  setLanguage(lang);
};

// Initialize language on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Precedence: User setting injected from server -> localStorage -> 'en'
  const serverLang = window.__INITIAL_USER_LANG__;
  const storedLang = localStorage.getItem('mo_safai_lang');
  const initialLang = serverLang || storedLang || 'en';
  setLanguage(initialLang);
});
