package student

import (
	"fmt"
	"strconv"
	"strings"

	studentmodels "server/models/student"
)

func expandRange(from, to string) []string {
	var result []string

	prefixLen := 0
	for i := len(from) - 1; i >= 0; i-- {
		if from[i] < '0' || from[i] > '9' {
			prefixLen = i + 1
			break
		}
	}
	prefix := from[:prefixLen]
	fromNum, err1 := strconv.Atoi(from[prefixLen:])
	toNum, err2 := strconv.Atoi(to[prefixLen:])
	if err1 != nil || err2 != nil {
		return []string{from, to}
	}
	width := len(from[prefixLen:])
	for n := fromNum; n <= toNum; n++ {
		result = append(result, fmt.Sprintf("%s%0*d", prefix, width, n))
	}
	return result
}

// LookupHall returns the hall number for a given register number and course code.
func LookupHall(registerNo, courseCode string) (string, bool) {
	registerNo = strings.TrimSpace(strings.ToUpper(registerNo))
	courseCode = strings.TrimSpace(strings.ToUpper(courseCode))

	for _, entry := range sessionMetaList {
		records := entry.builder()
		meta := entry.meta

		for _, record := range records {
			actualCode := resolveCourseCode(record.CourseCode, meta.Date, meta.Session, meta.Semester)
			actualUpper := strings.ToUpper(actualCode)
			recordUpper := strings.ToUpper(record.CourseCode)
			match := actualUpper == courseCode ||
				recordUpper == courseCode ||
				strings.TrimSuffix(actualUpper, "*") == strings.TrimSuffix(courseCode, "*") ||
				strings.TrimSuffix(recordUpper, "*") == strings.TrimSuffix(courseCode, "*")
			if !match {
				continue
			}

			for _, reg := range record.RegisterNos {
				if strings.ToUpper(reg) == registerNo {
					return record.HallNo, true
				}
			}
		}
	}

	return "", false
}

// LookupAllByRegister returns all exam sessions for a given register number.
type sessionMeta struct {
	Date     string
	Session  string
	Time     string
	Semester string
}

// sessionIndex maps each build function's records to their date/session/time.
var sessionMetaList = []struct {
	builder func() []studentmodels.SeatingRecord
	meta    sessionMeta
}{
	{buildSeatingData11Nov2026FN, sessionMeta{"11-11-2026", "FN", "09:00 AM – 12:00 PM", ""}},
	{buildSeatingData11Nov2026AN, sessionMeta{"11-11-2026", "AN", "01:30 PM – 04:30 PM", ""}},
	{buildSeatingData13Nov2026FN, sessionMeta{"13-11-2026", "FN", "09:00 AM – 12:00 PM", ""}},
	{buildSeatingData13Nov2026AN, sessionMeta{"13-11-2026", "AN", "01:30 PM – 04:30 PM", ""}},
	{buildSeatingData14Nov2026FN, sessionMeta{"14-11-2026", "FN", "09:00 AM – 12:00 PM", ""}},
	{buildSeatingData16Nov2026FN, sessionMeta{"16-11-2026", "FN", "09:00 AM – 12:00 PM", ""}},
	{buildSeatingData16Nov2026AN, sessionMeta{"16-11-2026", "AN", "01:30 PM – 04:30 PM", ""}},
	{buildSeatingData17Nov2026FN, sessionMeta{"17-11-2026", "FN", "09:00 AM – 12:00 PM", ""}},
	{buildSeatingData18Nov2026FN, sessionMeta{"18-11-2026", "FN", "09:00 AM – 12:00 PM", ""}},
	{buildSeatingData18Nov2026AN, sessionMeta{"18-11-2026", "AN", "01:30 PM – 04:30 PM", ""}},
}

var courseNameMap = map[string]string{
	"AD":      "ARTIFICIAL INTELLIGENCE AND DATA SCIENCE",
	"AG":      "AGRICULTURAL ENGINEERING",
	"AL":      "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING",
	"BT":      "BIOTECHNOLOGY",
	"CB":      "COMPUTER SCIENCE AND BUSINESS SYSTEMS",
	"CD":      "COMPUTER SCIENCE AND DESIGN",
	"CS":      "COMPUTER SCIENCE AND ENGINEERING",
	"EC":      "ELECTRONICS AND COMMUNICATION ENGINEERING",
	"EE":      "ELECTRICAL AND ELECTRONICS ENGINEERING",
	"EI":      "ELECTRONICS AND INSTRUMENTATION ENGINEERING",
	"IT":      "INFORMATION TECHNOLOGY",
	"ME":      "MECHANICAL ENGINEERING",
	"MZ":      "MECHATRONICS ENGINEERING",
	"22CD007": "AGILE SOFTWARE DEVELOPMENT",
	"22AM001": "AGILE SOFTWARE DEVELOPMENT",
	"22HS004": "HUMAN VALUES AND ETHICS",
	"22HS005": "SOFT SKILLS AND EFFECTIVE COMMUNICATION",
	"22AG301": "NUMERICAL METHODS AND STATISTICS",
	"22AI301": "PROBABILITY AND STATISTICS",
	"22AM301": "PROBABILITY AND STATISTICS",
	"22BT301": "FOURIER SERIES, TRANSFORMS AND BIOSTATISTICS",
	"22CS301": "PROBABILITY, STATISTICS AND QUEUING THEORY",
	"22IT301": "PROBABILITY, STATISTICS AND QUEUING THEORY",
	"22EC301": "PROBABILITY, STATISTICS AND RANDOM PROCESS",
	"22EE301": "COMPLEX INTEGRATION, TRANSFORMS AND PARTIAL DIFFERENTIAL EQUATIONS",
	"22EI301": "TRANSFORMS AND PARTIAL DIFFERENTIAL EQUATIONS",
	"22MC301": "TRANSFORMS AND PARTIAL DIFFERENTIAL EQUATIONS",
	"22ME301": "ENGINEERING MATHEMATICS III",
	"22AG302": "SOIL SCIENCE AND ENGINEERING",
	"22AI302": "DATA STRUCTURES I",
	"22AM302": "DATA STRUCTURES I",
	"22CS302": "DATA STRUCTURES I",
	"22IT302": "DATA STRUCTURES I",
	"22BT302": "BIOCHEMISTRY",
	"22EC302": "CIRCUIT ANALYSIS",
	"22EE302": "CIRCUIT ANALYSIS",
	"22EI302": "ELECTRICAL CIRCUITS AND MACHINES",
	"22MC302": "ELECTRICAL CIRCUITS AND MACHINES",
	"22ME302": "ELECTRIC MACHINES AND DRIVES",
	"22AG303": "ENGINEERING THERMODYNAMICS",
	"22BT303": "ENGINEERING THERMODYNAMICS",
	"22ME303": "ENGINEERING THERMODYNAMICS",
	"22AI303": "COMPUTER ORGANIZATION AND ARCHITECTURE",
	"22AM303": "COMPUTER ORGANIZATION AND ARCHITECTURE",
	"22CS303": "COMPUTER ORGANIZATION AND ARCHITECTURE",
	"22IT303": "COMPUTER ORGANIZATION AND ARCHITECTURE",
	"22EC303": "DIGITAL LOGIC CIRCUIT DESIGN",
	"22EI303": "DIGITAL LOGIC CIRCUIT DESIGN",
	"22MC303": "DIGITAL LOGIC CIRCUIT DESIGN",
	"22EE303": "ELECTRICAL MACHINES I",
	"22AG304": "FLUID MECHANICS AND MACHINERY",
	"22ME304": "FLUID MECHANICS AND MACHINERY",
	"22MC304": "FLUID MECHANICS AND MACHINERY",
	"22AI304": "PRINCIPLES OF PROGRAMMING LANGUAGES",
	"22AM304": "PRINCIPLES OF PROGRAMMING LANGUAGES",
	"22CS304": "PRINCIPLES OF PROGRAMMING LANGUAGES",
	"22IT304": "PRINCIPLES OF PROGRAMMING LANGUAGES",
	"22BT304": "MICROBIOLOGY",
	"22EC304": "ANALOG ELECTRONICS AND INTEGRATED CIRCUITS",
	"22EE304": "ANALOG CIRCUITS AND SYSTEMS",
	"22EI304": "FLUID MECHANICS AND THERMODYNAMICS",
	"22AG305": "SURVEYING AND LEVELLING",
	"22AI305": "SOFTWARE ENGINEERING",
	"22AM305": "SOFTWARE ENGINEERING",
	"22CS305": "SOFTWARE ENGINEERING",
	"22IT305": "SOFTWARE ENGINEERING",
	"22BT305": "PROCESS CALCULATIONS AND UNIT OPERATIONS",
	"22EC305": "DATA STRUCTURES AND ALGORITHMS",
	"22EE305": "DATA STRUCTURES AND ALGORITHMS",
	"22EI305": "DATA STRUCTURES AND ALGORITHMS",
	"22ME305": "ENGINEERING MECHANICS",
	"22MC305": "ENGINEERING MECHANICS",
	"22HS505": "BUSINESS COMMUNICATION AND VALUE SCIENCE – III",
	"22AGH13": "REFRIGERATION AND COLD STORAGE",
	"22AIH13": "CYBER SECURITY",
	"22AMH13": "CYBER SECURITY",
	"22AGM13": "REFRIGERATION AND COLD STORAGE",
	"22BTH28": "ANIMAL PHYSIOLOGY AND METABOLISM",
	"22AIM43": "PYTHON FOR DATA SCIENCE",
	"22CSH30": "KNOWLEDGE ENGINEERING",
	"22EEH13": "ELECTRIC VEHICLE ARCHITECTURE",
	"22ECH07": "IOT PROTOCOLS AND INDUSTRIAL SENSORS",
	"22EIH02": "IOT PROTOCOLS AND INDUSTRIAL SENSORS",
	"22ITM07": "AGILE SOFTWARE DEVELOPMENT",
	"22CSM07": "AGILE SOFTWARE DEVELOPMENT",
	"22ITH50": "IT INFRASTRUCTURE DESIGN",
	"22MEH36": "TOOL AND DIE DESIGN",
	"22MCH01": "MODELLING OF INDUSTRIAL ROBOTS",
	"22AGH16": "FOOD SAFETY MANAGEMENT SYSTEMS",
	"22AIH08": "CLOUD SERVICES AND DATA MANAGEMENT",
	"22AMH08": "CLOUD SERVICES AND DATA MANAGEMENT",
	"22AGM16": "FOOD SAFETY MANAGEMENT SYSTEMS",
	"22BTH29": "ANIMAL HEALTH AND NUTRITION",
	"22AIM45": "FUNDAMENTALS OF MACHINE LEARNING",
	"22CSH31": "SOFT COMPUTING",
	"22EEH14": "DESIGN OF MOTOR AND POWER CONVERTERS FOR ELECTRIC VEHICLES",
	"22ECH08": "IOT PROCESSORS",
	"22EIH03": "IOT PROCESSORS",
	"22ITM08": "UI AND UX DESIGN",
	"22CSM08": "UI AND UX DESIGN",
	"22ITH51": "DATA CENTRE DESIGN",
	"22MEH37": "GEOMETRIC MODELLING",
	"22MCH02": "ROBOT CONTROL USING ROS",
	"22AG501": "TRACTOR AND FARM ENGINES",
	"22AI501": "ARTIFICIAL INTELLIGENCE",
	"22AM501": "ARTIFICIAL INTELLIGENCE",
	"22BT501": "GENETIC ENGINEERING",
	"22CB501": "COMPILER DESIGN",
	"22CS501": "THEORY OF COMPUTATION",
	"22EE501": "POWER SYSTEM ANALYSIS",
	"22EC501": "DIGITAL COMMUNICATION",
	"22EI501": "INDUSTRIAL INSTRUMENTATION",
	"22IT501": "PRINCIPLES OF COMMUNICATION",
	"22ME501": "MECHATRONICS",
	"22MC501": "ROBOTICS AND MACHINE VISION",
	"22AG502": "UNIT OPERATIONS IN AGRICULTURAL PROCESS ENGINEERING",
	"22AI502": "COMPUTER NETWORKS",
	"22CS502": "COMPUTER NETWORKS",
	"22IT502": "COMPUTER NETWORKS",
	"22AM502": "BIG DATA TECHNOLOGIES",
	"22BT502": "BIOPROCESS ENGINEERING",
	"22CB502": "BUSINESS STRATEGY",
	"22EE502": "POWER ELECTRONICS",
	"22EC502": "DIGITAL SIGNAL PROCESSING",
	"22EI502": "ELECTRONIC INSTRUMENTATION AND MEASUREMENTS",
	"22ME502": "DESIGN OF MACHINE ELEMENTS",
	"22MC502": "MANUFACTURING TECHNOLOGY",
	"22AG503": "SOIL AND WATER CONSERVATION ENGINEERING",
	"22AI503": "MACHINE LEARNING",
	"22AM503": "MACHINE LEARNING",
	"22BT503": "ANIMAL TISSUE CULTURE",
	"22CB503": "SOFTWARE DESIGN WITH UML",
	"22CS503": "MACHINE LEARNING ESSENTIALS",
	"22EE503": "OPTIMIZATION IN ENGINEERING DESIGN",
	"22EC503": "TRANSMISSION LINES AND ANTENNAS",
	"22EI503": "INTERNET OF THINGS",
	"22IT503": "INFORMATION CODING TECHNIQUES",
	"22ME503": "THERMAL ENGINEERING",
	"22MC503": "THERMODYNAMICS AND HEAT TRANSFER",
	"22AG504": "RENEWABLE ENERGY SOURCES",
	"22AI504": "CLOUD COMPUTING",
	"22AM504": "CLOUD COMPUTING",
	"22BT504": "BIOINFORMATICS",
	"22CB504": "FINANCIAL AND COST ACCOUNTING",
	"22CS504": "FREE OPEN SOURCE SOFTWARE",
	"22EE504": "CONTROL SYSTEMS",
	"22EI504": "CONTROL SYSTEMS",
	"22EC504": "INTERNET OF THINGS AND ITS APPLICATIONS",
	"22IT504": "INTERNET OF THINGS",
	"22ME504": "MACHINING AND METROLOGY",
	"22MC504": "CONTROL SYSTEMS ENGINEERING",
	"22AG026": "SOIL FERTILITY AND NUTRIENT MANAGEMENT",
	"22AI028": "BIG DATA ANALYTICS",
	"22AI019": "ROBOTIC PROCESS AUTOMATION",
	"22AM019": "ROBOTIC PROCESS AUTOMATION",
	"22AM026": "E COMMERCE AND WEB DEVELOPMENT",
	"22BT002": "INDUSTRIAL MICROBIOLOGY",
	"22BT010": "FOOD PROCESS AND TECHNOLOGY",
	"22CB012": "SOFTWARE TESTING AND AUTOMATION",
	"22CS010": "APP DEVELOPMENT",
	"22IT010": "APP DEVELOPMENT",
	"22CS001": "EXPLORATORY DATA ANALYSIS",
	"22CS025": "MULTIMEDIA AND ANIMATION",
	"22IT025": "MULTIMEDIA AND ANIMATION",
	"22EE019": "SOLAR ENERGY CONVERSION SYSTEMS",
	"22EC002": "COMMUNICATION PROTOCOLS AND STANDARDS",
	"22EC037": "SOFT COMPUTING TECHNIQUES",
	"22EI015": "VIRTUAL INSTRUMENTATION",
	"22ME012": "WELDING TECHNOLOGY",
	"22ME002": "COMPOSITE MATERIALS AND MECHANICS",
	"22MC015": "AUTOMOTIVE INFOTRONICS",
	"22OBT01": "BIOFUELS",
	"22OEE02": "ELECTRICAL SAFETY",
	"22OME02": "INDUSTRIAL PROCESS ENGINEERING",
	"22OCB01": "INTERNATIONAL BUSINESS MANAGEMENT",
	"22OEI02": "SENSOR TECHNOLOGY",
	"22OME01": "DIGITAL MANUFACTURING",
	"22OAG01": "RAINWATER HARVESTING TECHNIQUES",
	"22OEC03": "PRINCIPLES OF COMMUNICATION SYSTEMS",
	"22OCS02": "JAVA FUNDAMENTALS",
	"22OAI01": "FUNDAMENTALS OF DATA SCIENCE",
	"22OIT06": "CLOUD INFRASTRUCTURE",
	"22HS006": "TAMILS AND TECHNOLOGY",
	"22MA101": "ENGINEERING MATHEMATICS I",
	"22CB101": "",
	"24MB101": "",
	"22GE004": "BASICS OF ELECTRONICS ENGINEERING",
	"24MB202": "",
	"24CS22":  "",
	"24IS22":  "",
	"22HS003": "HERITAGE OF TAMILS",
	"24MB102": "",
	"22HS001": "FOUNDATIONAL ENGLISH",
	"24MB104": "",
	"22GE003": "BASICS OF ELECTRICAL ENGINEERING",
	"22CH103": "ENGINEERING CHEMISTRY I",
	"22CB103": "",
	"24MB103": "",
	"22CD206": "",
	"22CT206": "",
	"24MB203": "",
	"22AI206": "DIGITAL COMPUTER ELECTRONICS",
	"22CS206": "DIGITAL COMPUTER ELECTRONICS",
	"22IT206": "DIGITAL COMPUTER ELECTRONICS",
	"22AM206": "DIGITAL COMPUTER ELECTRONICS",
	"22IS206": "",
	"24IS23":  "",
	"24CS23":  "",
	"22MA201": "ENGINEERING MATHEMATICS II",
	"24MB205": "",
	"24CS54":  "",
	"24IS55":  "",
	"22PH102": "ENGINEERING PHYSICS",
	"22CB102": "",
	"24MB105": "",
	"22PH202": "ELECTROMAGNETISM AND MODERN PHYSICS",
	"24MB206": "",
	"22CB201": "",
	"24CS58":  "",
	"22CB106": "",
	"24MB106": "",
	"22CH203": "ENGINEERING CHEMISTRY II",
	"22CB205": "",
	"24CS57":  "",
	"24IS63":  "",
	"22GE001": "FUNDAMENTALS OF COMPUTING",
	"22CB104": "",
	"22GE002": "COMPUTATIONAL PROBLEM SOLVING",
	"22CB203": "",
	"24CS69":  "",
	"22HS201": "COMMUNICATIVE ENGLISH II",
	"22CB204": "",
	"24CS21":  "",
	"24IS21":  "",
	"24CS24":  "",
	"24IS24":  "",
	"22CB202": "",
	"24MB204": "",
}

// deptSessionToCourse maps "[SEMESTER|]BRANCH|DATE|SESSION" to official course code from the Periodical Test II timetable
var deptSessionToCourse = map[string]string{
	// ─── 2nd Year (Semester III) ──────────────────────────────────────────────
	// 24.10.2026 FN - Common to all Semester III
	"SEM3|AD|24-10-2026|FN": "22HS004", "SEM3|AG|24-10-2026|FN": "22HS004", "SEM3|AL|24-10-2026|FN": "22HS004",
	"SEM3|AM|24-10-2026|FN": "22HS004", "SEM3|BT|24-10-2026|FN": "22HS004", "SEM3|CB|24-10-2026|FN": "22HS004",
	"SEM3|CS|24-10-2026|FN": "22HS004", "SEM3|EC|24-10-2026|FN": "22HS004", "SEM3|EE|24-10-2026|FN": "22HS004",
	"SEM3|EI|24-10-2026|FN": "22HS004", "SEM3|IT|24-10-2026|FN": "22HS004", "SEM3|ME|24-10-2026|FN": "22HS004",
	"SEM3|MC|24-10-2026|FN": "22HS004", "SEM3|MZ|24-10-2026|FN": "22HS004",

	// 24.10.2026 AN - Common to all Semester III
	"SEM3|AD|24-10-2026|AN": "22HS005", "SEM3|AG|24-10-2026|AN": "22HS005", "SEM3|AL|24-10-2026|AN": "22HS005",
	"SEM3|AM|24-10-2026|AN": "22HS005", "SEM3|BT|24-10-2026|AN": "22HS005", "SEM3|CB|24-10-2026|AN": "22HS005",
	"SEM3|CS|24-10-2026|AN": "22HS005", "SEM3|EC|24-10-2026|AN": "22HS005", "SEM3|EE|24-10-2026|AN": "22HS005",
	"SEM3|EI|24-10-2026|AN": "22HS005", "SEM3|IT|24-10-2026|AN": "22HS005", "SEM3|ME|24-10-2026|AN": "22HS005",
	"SEM3|MC|24-10-2026|AN": "22HS005", "SEM3|MZ|24-10-2026|AN": "22HS005",

	// 26.10.2026 FN
	"SEM3|AG|26-10-2026|FN": "22AG301", "SEM3|AD|26-10-2026|FN": "22AI301", "SEM3|AL|26-10-2026|FN": "22AM301",
	"SEM3|AM|26-10-2026|FN": "22AM301", "SEM3|BT|26-10-2026|FN": "22BT301", "SEM3|CS|26-10-2026|FN": "22CS301",
	"SEM3|IT|26-10-2026|FN": "22IT301", "SEM3|EC|26-10-2026|FN": "22EC301", "SEM3|EE|26-10-2026|FN": "22EE301",
	"SEM3|EI|26-10-2026|FN": "22EI301", "SEM3|MC|26-10-2026|FN": "22MC301", "SEM3|MZ|26-10-2026|FN": "22MC301",
	"SEM3|ME|26-10-2026|FN": "22ME301",

	// 26.10.2026 AN
	"SEM3|AG|26-10-2026|AN": "22AG302", "SEM3|AD|26-10-2026|AN": "22AI302", "SEM3|AL|26-10-2026|AN": "22AM302",
	"SEM3|AM|26-10-2026|AN": "22AM302", "SEM3|CS|26-10-2026|AN": "22CS302", "SEM3|IT|26-10-2026|AN": "22IT302",
	"SEM3|BT|26-10-2026|AN": "22BT302", "SEM3|EC|26-10-2026|AN": "22EC302", "SEM3|EE|26-10-2026|AN": "22EE302",
	"SEM3|EI|26-10-2026|AN": "22EI302", "SEM3|MC|26-10-2026|AN": "22MC302", "SEM3|MZ|26-10-2026|AN": "22MC302",
	"SEM3|ME|26-10-2026|AN": "22ME302",

	// 27.10.2026 FN
	"SEM3|AG|27-10-2026|FN": "22AG303", "SEM3|BT|27-10-2026|FN": "22BT303", "SEM3|ME|27-10-2026|FN": "22ME303",
	"SEM3|AD|27-10-2026|FN": "22AI303", "SEM3|AL|27-10-2026|FN": "22AM303", "SEM3|AM|27-10-2026|FN": "22AM303",
	"SEM3|CS|27-10-2026|FN": "22CS303", "SEM3|IT|27-10-2026|FN": "22IT303", "SEM3|EC|27-10-2026|FN": "22EC303",
	"SEM3|EI|27-10-2026|FN": "22EI303", "SEM3|MC|27-10-2026|FN": "22MC303", "SEM3|MZ|27-10-2026|FN": "22MC303",
	"SEM3|EE|27-10-2026|FN": "22EE303",

	// 27.10.2026 AN
	"SEM3|AG|27-10-2026|AN": "22AG304", "SEM3|ME|27-10-2026|AN": "22ME304", "SEM3|MC|27-10-2026|AN": "22MC304",
	"SEM3|MZ|27-10-2026|AN": "22MC304", "SEM3|AD|27-10-2026|AN": "22AI304", "SEM3|AL|27-10-2026|AN": "22AM304",
	"SEM3|AM|27-10-2026|AN": "22AM304", "SEM3|CS|27-10-2026|AN": "22CS304", "SEM3|IT|27-10-2026|AN": "22IT304",
	"SEM3|BT|27-10-2026|AN": "22BT304", "SEM3|EC|27-10-2026|AN": "22EC304", "SEM3|EE|27-10-2026|AN": "22EE304",
	"SEM3|EI|27-10-2026|AN": "22EI304",

	// 28.10.2026 FN
	"SEM3|AG|28-10-2026|FN": "22AG305", "SEM3|AD|28-10-2026|FN": "22AI305", "SEM3|AL|28-10-2026|FN": "22AM305",
	"SEM3|AM|28-10-2026|FN": "22AM305", "SEM3|CS|28-10-2026|FN": "22CS305", "SEM3|IT|28-10-2026|FN": "22IT305",
	"SEM3|BT|28-10-2026|FN": "22BT305", "SEM3|EC|28-10-2026|FN": "22EC305", "SEM3|EE|28-10-2026|FN": "22EE305",
	"SEM3|EI|28-10-2026|FN": "22EI305", "SEM3|ME|28-10-2026|FN": "22ME305", "SEM3|MC|28-10-2026|FN": "22MC305",
	"SEM3|MZ|28-10-2026|FN": "22MC305",

	// 29.10.2026
	"SEM3|AD|29-10-2026|AN": "22AI302",
	"SEM3|CS|29-10-2026|FN": "22CS302", "SEM3|CS|29-10-2026|AN": "22CS302",
	"SEM3|IT|29-10-2026|FN": "22IT302", "SEM3|IT|29-10-2026|AN": "22IT302",
	"SEM3|EC|29-10-2026|FN": "22EC303", "SEM3|EC|29-10-2026|AN": "22EC303",

	// 30.10.2026
	"SEM3|AD|30-10-2026|FN": "22AI304",
	"SEM3|AL|30-10-2026|FN": "22AM302", "SEM3|AL|30-10-2026|AN": "22AM302",
	"SEM3|AM|30-10-2026|FN": "22AM302", "SEM3|AM|30-10-2026|AN": "22AM302",
	"SEM3|IT|30-10-2026|FN": "22IT302", "SEM3|IT|30-10-2026|AN": "22IT302",
	"SEM3|EC|30-10-2026|FN": "22EC303", "SEM3|EC|30-10-2026|AN": "22EC303",

	// 31.10.2026
	"SEM3|AL|31-10-2026|FN": "22AM304", "SEM3|AL|31-10-2026|AN": "22AM304",
	"SEM3|AM|31-10-2026|FN": "22AM304", "SEM3|AM|31-10-2026|AN": "22AM304",
	"SEM3|CS|31-10-2026|FN": "22CS304", "SEM3|CS|31-10-2026|AN": "22CS304",
	"SEM3|IT|31-10-2026|FN": "22IT304", "SEM3|IT|31-10-2026|AN": "22IT304",
	"SEM3|EC|31-10-2026|FN": "22EC305", "SEM3|EC|31-10-2026|AN": "22EC305",

	// ─── 3rd Year (Semester V) ───────────────────────────────────────────────
	// 23.10.2026 FN
	"SEM5|AG|23-10-2026|FN": "22AG501", "SEM5|AD|23-10-2026|FN": "22AI501", "SEM5|AL|23-10-2026|FN": "22AM501",
	"SEM5|AM|23-10-2026|FN": "22AM501", "SEM5|BT|23-10-2026|FN": "22BT501", "SEM5|CB|23-10-2026|FN": "22CB501",
	"SEM5|CS|23-10-2026|FN": "22CS501", "SEM5|EE|23-10-2026|FN": "22EE501", "SEM5|EC|23-10-2026|FN": "22EC501",
	"SEM5|EI|23-10-2026|FN": "22EI501", "SEM5|IT|23-10-2026|FN": "22IT501", "SEM5|ME|23-10-2026|FN": "22ME501",
	"SEM5|MC|23-10-2026|FN": "22MC501", "SEM5|MZ|23-10-2026|FN": "22MC501",

	// 23.10.2026 AN
	"SEM5|AG|23-10-2026|AN": "22AG502", "SEM5|AD|23-10-2026|AN": "22AI502", "SEM5|CS|23-10-2026|AN": "22CS502",
	"SEM5|IT|23-10-2026|AN": "22IT502", "SEM5|AL|23-10-2026|AN": "22AM502", "SEM5|AM|23-10-2026|AN": "22AM502",
	"SEM5|BT|23-10-2026|AN": "22BT502", "SEM5|CB|23-10-2026|AN": "22CB502", "SEM5|EE|23-10-2026|AN": "22EE502",
	"SEM5|EC|23-10-2026|AN": "22EC502", "SEM5|EI|23-10-2026|AN": "22EI502", "SEM5|ME|23-10-2026|AN": "22ME502",
	"SEM5|MC|23-10-2026|AN": "22MC502", "SEM5|MZ|23-10-2026|AN": "22MC502",

	// 24.10.2026 FN
	"SEM5|AG|24-10-2026|FN": "22AG503", "SEM5|AD|24-10-2026|FN": "22AI503", "SEM5|AL|24-10-2026|FN": "22AM503",
	"SEM5|AM|24-10-2026|FN": "22AM503", "SEM5|BT|24-10-2026|FN": "22BT503", "SEM5|CB|24-10-2026|FN": "22CB503",
	"SEM5|CS|24-10-2026|FN": "22CS503", "SEM5|EE|24-10-2026|FN": "22EE503", "SEM5|EC|24-10-2026|FN": "22EC503",
	"SEM5|EI|24-10-2026|FN": "22EI503", "SEM5|IT|24-10-2026|FN": "22IT503", "SEM5|ME|24-10-2026|FN": "22ME503",
	"SEM5|MC|24-10-2026|FN": "22MC503", "SEM5|MZ|24-10-2026|FN": "22MC503",

	// 24.10.2026 AN
	"SEM5|AG|24-10-2026|AN": "22AG504", "SEM5|AD|24-10-2026|AN": "22AI504", "SEM5|AL|24-10-2026|AN": "22AM504",
	"SEM5|AM|24-10-2026|AN": "22AM504", "SEM5|BT|24-10-2026|AN": "22BT504", "SEM5|CB|24-10-2026|AN": "22CB504",
	"SEM5|CS|24-10-2026|AN": "22CS504", "SEM5|EE|24-10-2026|AN": "22EE504", "SEM5|EI|24-10-2026|AN": "22EI504",
	"SEM5|EC|24-10-2026|AN": "22EC504", "SEM5|IT|24-10-2026|AN": "22IT504", "SEM5|ME|24-10-2026|AN": "22ME504",
	"SEM5|MC|24-10-2026|AN": "22MC504", "SEM5|MZ|24-10-2026|AN": "22MC504",
}

// resolveCourseCode resolves department codes (e.g., "AD", "CS") to the specific course code
// scheduled for that date and session in the official timetable. If already a course code, it returns it unchanged.
func resolveCourseCode(rawCode, date, session, semester string) string {
	upper := strings.ToUpper(strings.TrimSpace(rawCode))
	date = strings.TrimSpace(date)
	session = strings.TrimSpace(session)
	if semester != "" {
		if courseCode, exists := deptSessionToCourse[semester+"|"+upper+"|"+date+"|"+session]; exists {
			return courseCode
		}
	}
	// Fallback to direct key if present
	if courseCode, exists := deptSessionToCourse[upper+"|"+date+"|"+session]; exists {
		return courseCode
	}
	return rawCode
}

// LookupAllByRegister returns all exam sessions for a given register number,
// including date, session, time, and course name label.
func LookupAllByRegister(registerNo string) []studentmodels.ExamSession {
	registerNo = strings.TrimSpace(strings.ToUpper(registerNo))

	var results []studentmodels.ExamSession
	seen := make(map[string]bool)

	for _, entry := range sessionMetaList {
		records := entry.builder()
		meta := entry.meta

		for _, record := range records {
			for _, reg := range record.RegisterNos {
				if strings.ToUpper(reg) == registerNo {
					timeVal := meta.Time
					if record.Time != "" {
						timeVal = record.Time
					}

					actualCourseCode := resolveCourseCode(record.CourseCode, meta.Date, meta.Session, meta.Semester)
					courseName := courseNameMap[strings.ToUpper(actualCourseCode)]
					if courseName == "" {
						courseName = courseNameMap[strings.ToUpper(record.CourseCode)]
					}
					if courseName == "" {
						courseName = actualCourseCode
					}

					key := record.HallNo + "|" + actualCourseCode + "|" + meta.Date + "|" + meta.Session + "|" + timeVal
					if !seen[key] {
						seen[key] = true
						results = append(results, studentmodels.ExamSession{
							HallNo:     record.HallNo,
							CourseCode: actualCourseCode,
							CourseName: courseName,
							Date:       meta.Date,
							Session:    meta.Session,
							Time:       timeVal,
							IsArrear:   false,
						})
					}
					break
				}
			}
		}
	}

	return results
}

var deptCodeNames = map[string]string{
	"AD": "Artificial Intelligence and Data Science",
	"AG": "Agricultural Engineering",
	"AL": "Artificial Intelligence and Machine Learning",
	"AM": "Artificial Intelligence and Machine Learning",
	"BT": "Biotechnology",
	"CB": "Computer Science and Business Systems",
	"CS": "Computer Science and Engineering",
	"EC": "Electronics and Communication Engineering",
	"EE": "Electrical and Electronics Engineering",
	"EI": "Electronics and Instrumentation Engineering",
	"IT": "Information Technology",
	"ME": "Mechanical Engineering",
	"MC": "Mechatronics Engineering",
	"MZ": "Mechatronics Engineering",
	"FD": "Food Technology",
	"FT": "Fashion Technology",
	"TX": "Textile Technology",
	"CT": "Computer Technology",
	"IS": "Information Science and Engineering",
}

func normalizeHallStr(h string) string {
	h = strings.ReplaceAll(strings.ToUpper(h), "COMMMUNICATION", "COMMUNICATION")
	return strings.ToUpper(strings.Join(strings.Fields(strings.TrimSpace(h)), " "))
}

func compactHallStr(h string) string {
	h = strings.ReplaceAll(strings.ToUpper(h), "COMMMUNICATION", "COMMUNICATION")
	return strings.ToUpper(strings.ReplaceAll(strings.TrimSpace(h), " ", ""))
}

func normalizeDateStr(d string) string {
	d = strings.TrimSpace(d)
	d = strings.ReplaceAll(d, ".", "-")
	d = strings.ReplaceAll(d, "/", "-")
	parts := strings.Split(d, "-")
	if len(parts) == 3 && len(parts[0]) == 4 {
		return fmt.Sprintf("%02s-%02s-%s", parts[2], parts[1], parts[0])
	}
	return d
}

func normalizeTimeStr(t string) string {
	t = strings.ReplaceAll(t, "–", "-")
	t = strings.ReplaceAll(t, "—", "-")
	t = strings.ReplaceAll(t, " TO ", "-")
	t = strings.ReplaceAll(t, " to ", "-")
	t = strings.ReplaceAll(t, " - ", "-")
	t = strings.ReplaceAll(t, " -", "-")
	t = strings.ReplaceAll(t, "- ", "-")
	t = strings.Join(strings.Fields(strings.TrimSpace(t)), " ")
	return strings.ToUpper(t)
}

func extractDeptName(regNo, courseCode string) string {
	reg := strings.ToUpper(strings.TrimSpace(regNo))
	var letters strings.Builder
	for _, r := range reg {
		if r >= 'A' && r <= 'Z' {
			letters.WriteRune(r)
		}
	}
	code := letters.String()
	if code != "" {
		if dept, ok := deptCodeNames[code]; ok {
			return dept
		}
	}
	courseCodeUpper := strings.ToUpper(strings.TrimSpace(courseCode))
	if dept, ok := deptCodeNames[courseCodeUpper]; ok {
		return dept
	}
	if name, ok := courseNameMap[courseCodeUpper]; ok && name != "" {
		return name
	}
	if code != "" {
		return code
	}
	return courseCodeUpper
}

// LookupHallMembers returns the list of students seated in a given hall for a given date and time/session.
func LookupHallMembers(hallNo, date, session, timeStr string) (studentmodels.HallMembersResponse, bool) {
	normTargetHall := normalizeHallStr(hallNo)
	compactTargetHall := compactHallStr(hallNo)

	if normTargetHall == "" {
		return studentmodels.HallMembersResponse{}, false
	}

	normTargetDate := normalizeDateStr(date)
	normTargetSession := strings.ToUpper(strings.TrimSpace(session))
	normTargetTime := normalizeTimeStr(timeStr)

	var (
		matchedHallName   string
		allSessions       []studentmodels.HallSessionOption
		seenSessions      = make(map[string]bool)
		members           []studentmodels.HallMember
		seenRegs          = make(map[string]bool)
		courseCountMap    = make(map[string]int)
		courseMetaMap     = make(map[string]studentmodels.HallCourseSummary)
		selectedDate      = normTargetDate
		selectedSession   = normTargetSession
		selectedTime      = timeStr
		anyHallMatchFound = false
	)

	// First pass: collect all available sessions for this hall and find exact matches
	for _, entry := range sessionMetaList {
		records := entry.builder()
		meta := entry.meta
		entryDateNorm := normalizeDateStr(meta.Date)

		for _, record := range records {
			recNormHall := normalizeHallStr(record.HallNo)
			recCompactHall := compactHallStr(record.HallNo)

			if recNormHall != normTargetHall && recCompactHall != compactTargetHall {
				continue
			}

			anyHallMatchFound = true
			if matchedHallName == "" {
				matchedHallName = record.HallNo
			}

			timeVal := meta.Time
			if record.Time != "" {
				timeVal = record.Time
			}

			sessKey := entryDateNorm + "|" + meta.Session + "|" + normalizeTimeStr(timeVal)
			if !seenSessions[sessKey] {
				seenSessions[sessKey] = true
				allSessions = append(allSessions, studentmodels.HallSessionOption{
					Date:    meta.Date,
					Session: meta.Session,
					Time:    timeVal,
				})
			}
		}
	}

	if !anyHallMatchFound {
		return studentmodels.HallMembersResponse{}, false
	}

	// If no date was provided and sessions exist, pick the first available
	if selectedDate == "" && len(allSessions) > 0 {
		selectedDate = normalizeDateStr(allSessions[0].Date)
		selectedSession = allSessions[0].Session
		selectedTime = allSessions[0].Time
		normTargetTime = normalizeTimeStr(selectedTime)
	}

	// Second pass: collect students for the selected session
	for _, entry := range sessionMetaList {
		records := entry.builder()
		meta := entry.meta
		entryDateNorm := normalizeDateStr(meta.Date)

		if selectedDate != "" && entryDateNorm != selectedDate {
			continue
		}

		if selectedSession != "" && !strings.EqualFold(meta.Session, selectedSession) {
			continue
		}

		for _, record := range records {
			recNormHall := normalizeHallStr(record.HallNo)
			recCompactHall := compactHallStr(record.HallNo)

			if recNormHall != normTargetHall && recCompactHall != compactTargetHall {
				continue
			}

			timeVal := meta.Time
			if record.Time != "" {
				timeVal = record.Time
			}

			if normTargetTime != "" && normalizeTimeStr(timeVal) != normTargetTime {
				continue
			}

			if selectedTime == "" {
				selectedTime = timeVal
			}
			if selectedSession == "" {
				selectedSession = meta.Session
			}
			if selectedDate == "" {
				selectedDate = meta.Date
			}

			actualCourseCode := resolveCourseCode(record.CourseCode, meta.Date, meta.Session, meta.Semester)
			courseName := courseNameMap[strings.ToUpper(actualCourseCode)]
			if courseName == "" {
				courseName = courseNameMap[strings.ToUpper(record.CourseCode)]
			}
			if courseName == "" {
				courseName = actualCourseCode
			}

			for _, reg := range record.RegisterNos {
				regUpper := strings.ToUpper(strings.TrimSpace(reg))
				if regUpper == "" || seenRegs[regUpper] {
					continue
				}
				seenRegs[regUpper] = true

				dept := extractDeptName(regUpper, record.CourseCode)

				member := studentmodels.HallMember{
					SeatNo:     len(members) + 1,
					RegisterNo: regUpper,
					CourseCode: actualCourseCode,
					CourseName: courseName,
					Department: dept,
					Time:       timeVal,
				}
				members = append(members, member)

				courseCountMap[actualCourseCode]++
				if _, ok := courseMetaMap[actualCourseCode]; !ok {
					courseMetaMap[actualCourseCode] = studentmodels.HallCourseSummary{
						CourseCode: actualCourseCode,
						CourseName: courseName,
						Department: dept,
					}
				}
			}
		}
	}

	var coursesSummary []studentmodels.HallCourseSummary
	for code, summary := range courseMetaMap {
		summary.Count = courseCountMap[code]
		coursesSummary = append(coursesSummary, summary)
	}

	response := studentmodels.HallMembersResponse{
		Success:           true,
		HallNo:            matchedHallName,
		Date:              selectedDate,
		Session:           selectedSession,
		Time:              selectedTime,
		TotalStudents:     len(members),
		Courses:           coursesSummary,
		Members:           members,
		AvailableSessions: allSessions,
	}

	return response, true
}
