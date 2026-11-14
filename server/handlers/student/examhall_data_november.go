package student

import (
	studentmodels "server/models/student"
)

// ============================================================================
// 11-11-2026 FORENOON SESSION (FN: 09:00 AM – 12:00 PM) - Total: 56 Students
// ============================================================================
func buildSeatingData11Nov2026FN() []studentmodels.SeatingRecord {
	return []studentmodels.SeatingRecord{
		// --------------------------------------------------------------------
		// Hall: WW 204 (Total: 25 candidates)
		// --------------------------------------------------------------------
		// B.E. BM - 22BMH36 (8 candidates)
		{HallNo: "WW 204", CourseCode: "22BMH36", RegisterNos: []string{
			"7376231BM105", "7376231BM109", "7376231BM114", "7376231BM115",
			"7376231BM130", "7376231BM133", "7376231BM145", "7376231BM151",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. BT - 22BTH32 (12 candidates)
		{HallNo: "WW 204", CourseCode: "22BTH32", RegisterNos: []string{
			"7376232BT113", "7376232BT121", "7376232BT128", "7376232BT138",
			"7376232BT139", "7376232BT158", "7376232BT167", "7376232BT169",
			"7376232BT171", "7376232BT184", "7376232BT207", "7376232BT211",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. IT - 22ITH05 (2 candidates)
		{HallNo: "WW 204", CourseCode: "22ITH05", RegisterNos: []string{
			"7376232IT127", "7376232IT161",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. AG - 22AGH23 (3 candidates)
		{HallNo: "WW 204", CourseCode: "22AGH23", RegisterNos: []string{
			"7376232AG103", "7376232AG116", "7376232AG137",
		}, Time: "09:00 AM – 12:00 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 205 (Total: 25 candidates)
		// --------------------------------------------------------------------
		// B.E. CE - 22CEH42 (1 candidate)
		{HallNo: "WW 205", CourseCode: "22CEH42", RegisterNos: []string{
			"7376231CE102",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. EC - 22ECH11 (3 candidates)
		{HallNo: "WW 205", CourseCode: "22ECH11", RegisterNos: []string{
			"7376231EC187", "7376231EC254", "7376231EC307",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. EC - 22ITM52* (3 candidates)
		{HallNo: "WW 205", CourseCode: "22ITM52*", RegisterNos: []string{
			"7376231EC133", "7376231EC295", "7376231EC327",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. EE - 22AMM46 (1 candidate)
		{HallNo: "WW 205", CourseCode: "22AMM46", RegisterNos: []string{
			"7376231EE123",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. ME - 22MEH40 (3 candidates)
		{HallNo: "WW 205", CourseCode: "22MEH40", RegisterNos: []string{
			"7376231ME105", "7376231ME126", "7376231ME157",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. BT - 22BMM36 (1 candidate)
		{HallNo: "WW 205", CourseCode: "22BMM36", RegisterNos: []string{
			"7376232BT133",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. FT - 22FTH17 (2 candidates)
		{HallNo: "WW 205", CourseCode: "22FTH17", RegisterNos: []string{
			"7376232FT113", "7376232FT114",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. IT - 22ITH05 (2 candidates)
		{HallNo: "WW 205", CourseCode: "22ITH05", RegisterNos: []string{
			"7376232IT257", "7376232IT271",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. CT - 22CTH05 (3 candidates)
		{HallNo: "WW 205", CourseCode: "22CTH05", RegisterNos: []string{
			"7376232CT126", "7376232CT132", "7376232CT134",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. AD - 22AIH11* (2 candidates)
		{HallNo: "WW 205", CourseCode: "22AIH11*", RegisterNos: []string{
			"7376232AD188", "7376232AD266",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. AL - 22AMH36 (2 candidates)
		{HallNo: "WW 205", CourseCode: "22AMH36", RegisterNos: []string{
			"7376232AL129", "7376232AL132",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. AG - 22AGH23 (2 candidates)
		{HallNo: "WW 205", CourseCode: "22AGH23", RegisterNos: []string{
			"7376232AG138", "7376232AG145",
		}, Time: "09:00 AM – 12:00 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 206 (Total: 6 candidates)
		// --------------------------------------------------------------------
		// B.E. EE - 22EEH17 (1 candidate)
		{HallNo: "WW 206", CourseCode: "22EEH17", RegisterNos: []string{
			"7376231EE122",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. ME - 22AMM46 (1 candidate)
		{HallNo: "WW 206", CourseCode: "22AMM46", RegisterNos: []string{
			"7376231ME161",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. SE - 22ISH29 (1 candidate)
		{HallNo: "WW 206", CourseCode: "22ISH29", RegisterNos: []string{
			"7376231SE116",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. MZ - 22MCH05 (2 candidates)
		{HallNo: "WW 206", CourseCode: "22MCH05", RegisterNos: []string{
			"7376231MZ112", "7376231MZ122",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. CB - 22CBH05 (1 candidate)
		{HallNo: "WW 206", CourseCode: "22CBH05", RegisterNos: []string{
			"7376232CB136",
		}, Time: "09:00 AM – 12:00 PM"},
	}
}

// ============================================================================
// 11-11-2026 AFTERNOON SESSION (AN: 01:30 PM – 04:30 PM) - Total: 147 Students
// ============================================================================
func buildSeatingData11Nov2026AN() []studentmodels.SeatingRecord {
	return []studentmodels.SeatingRecord{
		// --------------------------------------------------------------------
		// Hall: WW 204 (Total: 25 candidates)
		// --------------------------------------------------------------------
		// B.E. EC - 22ECH07 (10 candidates)
		{HallNo: "WW 204", CourseCode: "22ECH07", RegisterNos: []string{
			"7376241EC122", "7376241EC131", "7376241EC136", "7376241EC143",
			"7376241EC148", "7376241EC156", "7376241EC161", "7376241EC168",
			"7376241EC176", "7376241EC180",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AD - 22AIH13 (15 candidates)
		{HallNo: "WW 204", CourseCode: "22AIH13", RegisterNos: []string{
			"7376242AD109", "7376242AD112", "7376242AD113", "7376242AD119",
			"7376242AD134", "7376242AD138", "7376242AD150", "7376242AD151",
			"7376242AD159", "7376242AD168", "7376242AD180", "7376242AD192",
			"7376242AD229", "7376242AD235", "7376242AD252",
		}, Time: "01:30 PM – 04:30 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 205 (Total: 25 candidates)
		// --------------------------------------------------------------------
		// B.E. EC - 22ECH07 (10 candidates)
		{HallNo: "WW 205", CourseCode: "22ECH07", RegisterNos: []string{
			"7376241EC182", "7376241EC205", "7376241EC225", "7376241EC254",
			"7376241EC264", "7376241EC269", "7376241EC274", "7376241EC277",
			"7376241EC291", "7376241EC307",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EE - 22EEH13 (1 candidate)
		{HallNo: "WW 205", CourseCode: "22EEH13", RegisterNos: []string{
			"7376241EE105",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AD - 22AIH13 (14 candidates)
		{HallNo: "WW 205", CourseCode: "22AIH13", RegisterNos: []string{
			"7376242AD256", "7376242AD275", "7376242AD283", "7376242AD284",
			"7376242AD290", "7376242AD300", "7376242AD302", "7376242AD309",
			"7376242AD318", "7376242AD330", "7376242AD339", "7376242AD340",
			"7376252AD507", "7376252AD514",
		}, Time: "01:30 PM – 04:30 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 206 (Total: 25 candidates)
		// --------------------------------------------------------------------
		// B.E. CS - 22CSH30 (5 candidates)
		{HallNo: "WW 206", CourseCode: "22CSH30", RegisterNos: []string{
			"7376241CS107", "7376241CS108", "7376241CS117", "7376241CS146",
			"7376241CS192",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EC - 22ECH07 (5 candidates)
		{HallNo: "WW 206", CourseCode: "22ECH07", RegisterNos: []string{
			"7376241EC317", "7376241EC331", "7376241EC343", "7376241EC347",
			"7376241EC352",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EE - 22EEH13 (15 candidates)
		{HallNo: "WW 206", CourseCode: "22EEH13", RegisterNos: []string{
			"7376241EE111", "7376241EE119", "7376241EE126", "7376241EE131",
			"7376241EE134", "7376241EE156", "7376241EE164", "7376241EE169",
			"7376241EE173", "7376241EE180", "7376241EE182", "7376241EE184",
			"7376241EE186", "7376241EE187", "7376241EE192",
		}, Time: "01:30 PM – 04:30 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 207 (Total: 50 candidates)
		// --------------------------------------------------------------------
		// B.E. CS - 22CSH30 (11 candidates)
		{HallNo: "WW 207", CourseCode: "22CSH30", RegisterNos: []string{
			"7376241CS238", "7376241CS245", "7376241CS262", "7376241CS309",
			"7376241CS338", "7376241CS343", "7376241CS375", "7376241CS389",
			"7376241CS432", "7376241CS452", "7376251CS523",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EE - 22EEH13 (2 candidates)
		{HallNo: "WW 207", CourseCode: "22EEH13", RegisterNos: []string{
			"7376241EE201", "7376251EE509",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. MZ - 22MCH01 (11 candidates)
		{HallNo: "WW 207", CourseCode: "22MCH01", RegisterNos: []string{
			"7376241MZ106", "7376241MZ114", "7376241MZ117", "7376241MZ128",
			"7376241MZ133", "7376241MZ136", "7376241MZ140", "7376241MZ148",
			"7376241MZ152", "7376241MZ154", "7376241MZ156",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. BT - 22BTH28 (15 candidates)
		{HallNo: "WW 207", CourseCode: "22BTH28", RegisterNos: []string{
			"7376242BT114", "7376242BT115", "7376242BT126", "7376242BT133",
			"7376242BT135", "7376242BT139", "7376242BT140", "7376242BT152",
			"7376242BT157", "7376242BT173", "7376242BT187", "7376242BT197",
			"7376242BT201", "7376242BT202", "7376242BT221",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. IT - 22ITH50 (3 candidates)
		{HallNo: "WW 207", CourseCode: "22ITH50", RegisterNos: []string{
			"7376242IT133", "7376242IT259", "7376242IT311",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AL - 22AMH13 (8 candidates)
		{HallNo: "WW 207", CourseCode: "22AMH13", RegisterNos: []string{
			"7376242AL111", "7376242AL126", "7376242AL129", "7376242AL149",
			"7376242AL154", "7376242AL184", "7376242AL194", "7376242AL200",
		}, Time: "01:30 PM – 04:30 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 208 (Total: 22 candidates)
		// --------------------------------------------------------------------
		// B.E. CS - 22AGM13 (2 candidates)
		{HallNo: "WW 208", CourseCode: "22AGM13", RegisterNos: []string{
			"7376241CS126", "7376241CS328",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EI - 22CSM07 (2 candidates)
		{HallNo: "WW 208", CourseCode: "22CSM07", RegisterNos: []string{
			"7376241EI108", "7376241EI115",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EI - 22EIH02 (3 candidates)
		{HallNo: "WW 208", CourseCode: "22EIH02", RegisterNos: []string{
			"7376241EI102", "7376241EI132", "7376241EI147",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. ME - 22MEH36 (3 candidates)
		{HallNo: "WW 208", CourseCode: "22MEH36", RegisterNos: []string{
			"7376241ME131", "7376241ME148", "7376241ME153",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. MZ - 22AIM43 (1 candidate)
		{HallNo: "WW 208", CourseCode: "22AIM43", RegisterNos: []string{
			"7376251MZ502",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. IT - 22AGM13 (1 candidate)
		{HallNo: "WW 208", CourseCode: "22AGM13", RegisterNos: []string{
			"7376242IT349",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. IT - 22ITH50 (3 candidates)
		{HallNo: "WW 208", CourseCode: "22ITH50", RegisterNos: []string{
			"7376242IT326", "7376242IT333", "7376242IT344",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AD - 22AGM13 (2 candidates)
		{HallNo: "WW 208", CourseCode: "22AGM13", RegisterNos: []string{
			"7376242AD228", "7376242AD230",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AL - 22AMH13 (1 candidate)
		{HallNo: "WW 208", CourseCode: "22AMH13", RegisterNos: []string{
			"7376242AL203",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AG - 22AGH13 (4 candidates)
		{HallNo: "WW 208", CourseCode: "22AGH13", RegisterNos: []string{
			"7376242AG104", "7376242AG110", "7376242AG113", "7376242AG115",
		}, Time: "01:30 PM – 04:30 PM"},
	}
}

// ============================================================================
// 13-11-2026 FORENOON SESSION (FN: 09:00 AM – 12:00 PM) - Total: 56 Students
// ============================================================================
func buildSeatingData13Nov2026FN() []studentmodels.SeatingRecord {
	return []studentmodels.SeatingRecord{
		// --------------------------------------------------------------------
		// Hall: WW 204 (Total: 25 candidates)
		// --------------------------------------------------------------------
		// B.E. BM - 22BMH37 (8 candidates)
		{HallNo: "WW 204", CourseCode: "22BMH37", RegisterNos: []string{
			"7376231BM105", "7376231BM109", "7376231BM114", "7376231BM115",
			"7376231BM130", "7376231BM133", "7376231BM145", "7376231BM151",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. BT - 22BTH33 (12 candidates)
		{HallNo: "WW 204", CourseCode: "22BTH33", RegisterNos: []string{
			"7376232BT113", "7376232BT121", "7376232BT128", "7376232BT138",
			"7376232BT139", "7376232BT158", "7376232BT167", "7376232BT169",
			"7376232BT171", "7376232BT184", "7376232BT207", "7376232BT211",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. IT - 22ITH06 (2 candidates)
		{HallNo: "WW 204", CourseCode: "22ITH06", RegisterNos: []string{
			"7376232IT127", "7376232IT161",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. AG - 22AGH25 (3 candidates)
		{HallNo: "WW 204", CourseCode: "22AGH25", RegisterNos: []string{
			"7376232AG103", "7376232AG116", "7376232AG137",
		}, Time: "09:00 AM – 12:00 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 205 (Total: 25 candidates)
		// --------------------------------------------------------------------
		// B.E. CE - 22CEH25 (1 candidate)
		{HallNo: "WW 205", CourseCode: "22CEH25", RegisterNos: []string{
			"7376231CE102",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. EC - 22ECH12 (3 candidates)
		{HallNo: "WW 205", CourseCode: "22ECH12", RegisterNos: []string{
			"7376231EC187", "7376231EC254", "7376231EC307",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. EC - 22ITM53* (3 candidates)
		{HallNo: "WW 205", CourseCode: "22ITM53*", RegisterNos: []string{
			"7376231EC133", "7376231EC295", "7376231EC327",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. EE - 22AMM47 (1 candidate)
		{HallNo: "WW 205", CourseCode: "22AMM47", RegisterNos: []string{
			"7376231EE123",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. ME - 22MEH17 (3 candidates)
		{HallNo: "WW 205", CourseCode: "22MEH17", RegisterNos: []string{
			"7376231ME105", "7376231ME126", "7376231ME157",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. BT - 22BMM37 (1 candidate)
		{HallNo: "WW 205", CourseCode: "22BMM37", RegisterNos: []string{
			"7376232BT133",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. FT - 22FTH18 (2 candidates)
		{HallNo: "WW 205", CourseCode: "22FTH18", RegisterNos: []string{
			"7376232FT113", "7376232FT114",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. IT - 22ITH06 (2 candidates)
		{HallNo: "WW 205", CourseCode: "22ITH06", RegisterNos: []string{
			"7376232IT257", "7376232IT271",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. CT - 22CTH06 (3 candidates)
		{HallNo: "WW 205", CourseCode: "22CTH06", RegisterNos: []string{
			"7376232CT126", "7376232CT132", "7376232CT134",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. AD - 22AIH12 (2 candidates)
		{HallNo: "WW 205", CourseCode: "22AIH12", RegisterNos: []string{
			"7376232AD188", "7376232AD266",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. AL - 22AMH37 (2 candidates)
		{HallNo: "WW 205", CourseCode: "22AMH37", RegisterNos: []string{
			"7376232AL129", "7376232AL132",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. AG - 22AGH25 (2 candidates)
		{HallNo: "WW 205", CourseCode: "22AGH25", RegisterNos: []string{
			"7376232AG138", "7376232AG145",
		}, Time: "09:00 AM – 12:00 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 206 (Total: 6 candidates)
		// --------------------------------------------------------------------
		// B.E. EE - 22EEH18 (1 candidate)
		{HallNo: "WW 206", CourseCode: "22EEH18", RegisterNos: []string{
			"7376231EE122",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. ME - 22AMM47 (1 candidate)
		{HallNo: "WW 206", CourseCode: "22AMM47", RegisterNos: []string{
			"7376231ME161",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. SE - 22ISH30 (1 candidate)
		{HallNo: "WW 206", CourseCode: "22ISH30", RegisterNos: []string{
			"7376231SE116",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.E. MZ - 22MCH06 (2 candidates)
		{HallNo: "WW 206", CourseCode: "22MCH06", RegisterNos: []string{
			"7376231MZ112", "7376231MZ122",
		}, Time: "09:00 AM – 12:00 PM"},

		// B.Tech. CB - 22CBH06 (1 candidate)
		{HallNo: "WW 206", CourseCode: "22CBH06", RegisterNos: []string{
			"7376232CB136",
		}, Time: "09:00 AM – 12:00 PM"},
	}
}

// ============================================================================
// 13-11-2026 AFTERNOON SESSION (AN: 01:30 PM – 04:30 PM) - Total: 147 Students
// ============================================================================
func buildSeatingData13Nov2026AN() []studentmodels.SeatingRecord {
	return []studentmodels.SeatingRecord{
		// --------------------------------------------------------------------
		// Hall: WW 204 (Total: 25 candidates)
		// --------------------------------------------------------------------
		// B.E. EC - 22ECH08 (10 candidates)
		{HallNo: "WW 204", CourseCode: "22ECH08", RegisterNos: []string{
			"7376241EC122", "7376241EC131", "7376241EC136", "7376241EC143",
			"7376241EC148", "7376241EC156", "7376241EC161", "7376241EC168",
			"7376241EC176", "7376241EC180",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AD - 22AIH08 (15 candidates)
		{HallNo: "WW 204", CourseCode: "22AIH08", RegisterNos: []string{
			"7376242AD109", "7376242AD112", "7376242AD113", "7376242AD119",
			"7376242AD134", "7376242AD138", "7376242AD150", "7376242AD151",
			"7376242AD159", "7376242AD168", "7376242AD180", "7376242AD192",
			"7376242AD229", "7376242AD235", "7376242AD252",
		}, Time: "01:30 PM – 04:30 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 205 (Total: 25 candidates)
		// --------------------------------------------------------------------
		// B.E. EC - 22ECH08 (10 candidates)
		{HallNo: "WW 205", CourseCode: "22ECH08", RegisterNos: []string{
			"7376241EC182", "7376241EC205", "7376241EC225", "7376241EC254",
			"7376241EC264", "7376241EC269", "7376241EC274", "7376241EC277",
			"7376241EC291", "7376241EC307",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EE - 22EEH14 (1 candidate)
		{HallNo: "WW 205", CourseCode: "22EEH14", RegisterNos: []string{
			"7376241EE105",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AD - 22AIH08 (14 candidates)
		{HallNo: "WW 205", CourseCode: "22AIH08", RegisterNos: []string{
			"7376242AD256", "7376242AD275", "7376242AD283", "7376242AD284",
			"7376242AD290", "7376242AD300", "7376242AD302", "7376242AD309",
			"7376242AD318", "7376242AD330", "7376242AD339", "7376242AD340",
			"7376252AD507", "7376252AD514",
		}, Time: "01:30 PM – 04:30 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 206 (Total: 25 candidates)
		// --------------------------------------------------------------------
		// B.E. CS - 22CSH31 (5 candidates)
		{HallNo: "WW 206", CourseCode: "22CSH31", RegisterNos: []string{
			"7376241CS107", "7376241CS108", "7376241CS117", "7376241CS146",
			"7376241CS192",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EC - 22ECH08 (5 candidates)
		{HallNo: "WW 206", CourseCode: "22ECH08", RegisterNos: []string{
			"7376241EC317", "7376241EC331", "7376241EC343", "7376241EC347",
			"7376241EC352",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EE - 22EEH14 (15 candidates)
		{HallNo: "WW 206", CourseCode: "22EEH14", RegisterNos: []string{
			"7376241EE111", "7376241EE119", "7376241EE126", "7376241EE131",
			"7376241EE134", "7376241EE156", "7376241EE164", "7376241EE169",
			"7376241EE173", "7376241EE180", "7376241EE182", "7376241EE184",
			"7376241EE186", "7376241EE187", "7376241EE192",
		}, Time: "01:30 PM – 04:30 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 207 (Total: 50 candidates)
		// --------------------------------------------------------------------
		// B.E. CS - 22CSH31 (11 candidates)
		{HallNo: "WW 207", CourseCode: "22CSH31", RegisterNos: []string{
			"7376241CS238", "7376241CS245", "7376241CS262", "7376241CS309",
			"7376241CS338", "7376241CS343", "7376241CS375", "7376241CS389",
			"7376241CS432", "7376241CS452", "7376251CS523",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EE - 22EEH14 (2 candidates)
		{HallNo: "WW 207", CourseCode: "22EEH14", RegisterNos: []string{
			"7376241EE201", "7376251EE509",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. MZ - 22MCH02 (11 candidates)
		{HallNo: "WW 207", CourseCode: "22MCH02", RegisterNos: []string{
			"7376241MZ106", "7376241MZ114", "7376241MZ117", "7376241MZ128",
			"7376241MZ133", "7376241MZ136", "7376241MZ140", "7376241MZ148",
			"7376241MZ152", "7376241MZ154", "7376241MZ156",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. BT - 22BTH29 (15 candidates)
		{HallNo: "WW 207", CourseCode: "22BTH29", RegisterNos: []string{
			"7376242BT114", "7376242BT115", "7376242BT126", "7376242BT133",
			"7376242BT135", "7376242BT139", "7376242BT140", "7376242BT152",
			"7376242BT157", "7376242BT173", "7376242BT187", "7376242BT197",
			"7376242BT201", "7376242BT202", "7376242BT221",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. IT - 22ITH51 (3 candidates)
		{HallNo: "WW 207", CourseCode: "22ITH51", RegisterNos: []string{
			"7376242IT133", "7376242IT259", "7376242IT311",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AL - 22AMH08 (8 candidates)
		{HallNo: "WW 207", CourseCode: "22AMH08", RegisterNos: []string{
			"7376242AL111", "7376242AL126", "7376242AL129", "7376242AL149",
			"7376242AL154", "7376242AL184", "7376242AL194", "7376242AL200",
		}, Time: "01:30 PM – 04:30 PM"},

		// --------------------------------------------------------------------
		// Hall: WW 208 (Total: 22 candidates)
		// --------------------------------------------------------------------
		// B.E. CS - 22AGM16 (2 candidates)
		{HallNo: "WW 208", CourseCode: "22AGM16", RegisterNos: []string{
			"7376241CS126", "7376241CS328",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EI - 22CSM08 (2 candidates)
		{HallNo: "WW 208", CourseCode: "22CSM08", RegisterNos: []string{
			"7376241EI108", "7376241EI115",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. EI - 22EIH03 (3 candidates)
		{HallNo: "WW 208", CourseCode: "22EIH03", RegisterNos: []string{
			"7376241EI102", "7376241EI132", "7376241EI147",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. ME - 22MEH37 (3 candidates)
		{HallNo: "WW 208", CourseCode: "22MEH37", RegisterNos: []string{
			"7376241ME131", "7376241ME148", "7376241ME153",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.E. MZ - 22AIM45 (1 candidate)
		{HallNo: "WW 208", CourseCode: "22AIM45", RegisterNos: []string{
			"7376251MZ502",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. IT - 22AGM16 (1 candidate)
		{HallNo: "WW 208", CourseCode: "22AGM16", RegisterNos: []string{
			"7376242IT349",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. IT - 22ITH51 (3 candidates)
		{HallNo: "WW 208", CourseCode: "22ITH51", RegisterNos: []string{
			"7376242IT326", "7376242IT333", "7376242IT344",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AD - 22AGM16 (2 candidates)
		{HallNo: "WW 208", CourseCode: "22AGM16", RegisterNos: []string{
			"7376242AD228", "7376242AD230",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AL - 22AMH08 (1 candidate)
		{HallNo: "WW 208", CourseCode: "22AMH08", RegisterNos: []string{
			"7376242AL203",
		}, Time: "01:30 PM – 04:30 PM"},

		// B.Tech. AG - 22AGH16 (4 candidates)
		{HallNo: "WW 208", CourseCode: "22AGH16", RegisterNos: []string{
			"7376242AG104", "7376242AG110", "7376242AG113", "7376242AG115",
		}, Time: "01:30 PM – 04:30 PM"},
	}
}

// ============================================================================
// 14-11-2026 FORENOON SESSION (FN: 09:00 AM – 12:00 PM) - Total: 1890 Students
// ============================================================================
func buildSeatingData14Nov2026FN() []studentmodels.SeatingRecord {
	return []studentmodels.SeatingRecord{
		// --- Hall: ME 201 ---
		// S.No 1: B.E. CS - 22HS005 (25 candidates)
		{HallNo: "ME 201", CourseCode: "22HS005", RegisterNos: expandRange("7376251CS101", "7376251CS125"), Time: "09:00 AM – 12:00 PM"},
		// S.No 2: B.Tech. AD - 22HS005 (20 candidates)
		{HallNo: "ME 201", CourseCode: "22HS005", RegisterNos: expandRange("7376252AD101", "7376252AD120"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: ME 202 ---
		// S.No 3: B.E. CS - 22HS005 (25 candidates)
		{HallNo: "ME 202", CourseCode: "22HS005", RegisterNos: append(expandRange("7376251CS126", "7376251CS128"), expandRange("7376251CS130", "7376251CS151")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 4: B.Tech. AD - 22HS005 (20 candidates)
		{HallNo: "ME 202", CourseCode: "22HS005", RegisterNos: expandRange("7376252AD121", "7376252AD140"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: ME 203 ---
		// S.No 5: B.E. CS - 22HS005 (25 candidates)
		{HallNo: "ME 203", CourseCode: "22HS005", RegisterNos: append(expandRange("7376251CS152", "7376251CS168"), expandRange("7376251CS170", "7376251CS177")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 6: B.Tech. AD - 22HS005 (20 candidates)
		{HallNo: "ME 203", CourseCode: "22HS005", RegisterNos: expandRange("7376252AD141", "7376252AD160"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: ME 204 ---
		// S.No 7: B.E. CS - 22HS005 (25 candidates)
		{HallNo: "ME 204", CourseCode: "22HS005", RegisterNos: expandRange("7376251CS178", "7376251CS202"), Time: "09:00 AM – 12:00 PM"},
		// S.No 8: B.Tech. AD - 22HS005 (20 candidates)
		{HallNo: "ME 204", CourseCode: "22HS005", RegisterNos: expandRange("7376252AD161", "7376252AD180"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: ME 205 ---
		// S.No 9: B.E. CS - 22HS005 (25 candidates)
		{HallNo: "ME 205", CourseCode: "22HS005", RegisterNos: expandRange("7376251CS203", "7376251CS227"), Time: "09:00 AM – 12:00 PM"},
		// S.No 10: B.Tech. AD - 22HS005 (20 candidates)
		{HallNo: "ME 205", CourseCode: "22HS005", RegisterNos: expandRange("7376252AD181", "7376252AD200"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: ME 206 ---
		// S.No 11: B.E. CS - 22HS005 (25 candidates)
		{HallNo: "ME 206", CourseCode: "22HS005", RegisterNos: append([]string{"7376251CS228"}, expandRange("7376251CS230", "7376251CS253")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 12: B.Tech. AD - 22HS005 (20 candidates)
		{HallNo: "ME 206", CourseCode: "22HS005", RegisterNos: expandRange("7376252AD201", "7376252AD220"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: ME 301 ---
		// S.No 13: B.E. CS - 22HS005 (25 candidates)
		{HallNo: "ME 301", CourseCode: "22HS005", RegisterNos: expandRange("7376251CS254", "7376251CS278"), Time: "09:00 AM – 12:00 PM"},
		// S.No 14: B.Tech. AD - 22HS005 (20 candidates)
		{HallNo: "ME 301", CourseCode: "22HS005", RegisterNos: expandRange("7376252AD221", "7376252AD240"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: ME 302 ---
		// S.No 15: B.E. CS - 22HS005 (25 candidates)
		{HallNo: "ME 302", CourseCode: "22HS005", RegisterNos: expandRange("7376251CS279", "7376251CS303"), Time: "09:00 AM – 12:00 PM"},
		// S.No 16: B.Tech. AD - 22HS005 (20 candidates)
		{HallNo: "ME 302", CourseCode: "22HS005", RegisterNos: expandRange("7376252AD241", "7376252AD260"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: ME 303 ---
		// S.No 17: B.E. CS - 22HS005 (25 candidates)
		{HallNo: "ME 303", CourseCode: "22HS005", RegisterNos: expandRange("7376251CS304", "7376251CS328"), Time: "09:00 AM – 12:00 PM"},
		// S.No 18: B.Tech. AD - 22HS005 (20 candidates)
		{HallNo: "ME 303", CourseCode: "22HS005", RegisterNos: expandRange("7376252AD261", "7376252AD280"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: ME 304 ---
		// S.No 19: B.E. CS - 22HS005 (25 candidates)
		{HallNo: "ME 304", CourseCode: "22HS005", RegisterNos: expandRange("7376251CS329", "7376251CS353"), Time: "09:00 AM – 12:00 PM"},
		// S.No 20: B.Tech. AD - 22HS005 (20 candidates)
		{HallNo: "ME 304", CourseCode: "22HS005", RegisterNos: expandRange("7376252AD281", "7376252AD300"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: ME 305 ---
		// S.No 21: B.E. CS - 22HS005 (25 candidates)
		{HallNo: "ME 305", CourseCode: "22HS005", RegisterNos: append(expandRange("7376251CS354", "7376251CS371"), expandRange("7376251CS373", "7376251CS379")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 22: B.Tech. AD - 22HS005 (20 candidates)
		{HallNo: "ME 305", CourseCode: "22HS005", RegisterNos: expandRange("7376252AD301", "7376252AD320"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: SF 001 ---
		// S.No 23: B.E. MZ - 22HS005 (20 candidates)
		{HallNo: "SF 001", CourseCode: "22HS005", RegisterNos: expandRange("7376251MZ122", "7376251MZ141"), Time: "09:00 AM – 12:00 PM"},
		// S.No 24: B.Tech. BT - 22HS005 (20 candidates)
		{HallNo: "SF 001", CourseCode: "22HS005", RegisterNos: expandRange("7376252BT123", "7376252BT142"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: SF 002 ---
		// S.No 25: B.E. MZ - 22HS005 (20 candidates)
		{HallNo: "SF 002", CourseCode: "22HS005", RegisterNos: expandRange("7376251MZ142", "7376251MZ161"), Time: "09:00 AM – 12:00 PM"},
		// S.No 26: B.Tech. BT - 22HS005 (20 candidates)
		{HallNo: "SF 002", CourseCode: "22HS005", RegisterNos: append(expandRange("7376252BT143", "7376252BT153"), expandRange("7376252BT155", "7376252BT163")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: SF 101 ---
		// S.No 27: B.E. ME - 22HS005 (15 candidates)
		{HallNo: "SF 101", CourseCode: "22HS005", RegisterNos: expandRange("7376251ME102", "7376251ME116"), Time: "09:00 AM – 12:00 PM"},
		// S.No 28: B.E. MZ - 22HS005 (5 candidates)
		{HallNo: "SF 101", CourseCode: "22HS005", RegisterNos: append([]string{"7376251MZ162"}, expandRange("7376261MZ502", "7376261MZ505")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 29: B.Tech. BT - 22HS005 (20 candidates)
		{HallNo: "SF 101", CourseCode: "22HS005", RegisterNos: expandRange("7376252BT164", "7376252BT183"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: SF 102 ---
		// S.No 30: B.E. ME - 22HS005 (20 candidates)
		{HallNo: "SF 102", CourseCode: "22HS005", RegisterNos: expandRange("7376251ME117", "7376251ME136"), Time: "09:00 AM – 12:00 PM"},
		// S.No 31: B.Tech. BT - 22HS005 (20 candidates)
		{HallNo: "SF 102", CourseCode: "22HS005", RegisterNos: append(append(expandRange("7376252BT184", "7376252BT189"), expandRange("7376252BT191", "7376252BT197")...), expandRange("7376252BT199", "7376252BT205")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: SF 103 ---
		// S.No 32: B.E. EI - 22HS005 (1 candidates)
		{HallNo: "SF 103", CourseCode: "22HS005", RegisterNos: []string{"7376251EI101"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 33: B.E. ME - 22HS005 (20 candidates)
		{HallNo: "SF 103", CourseCode: "22HS005", RegisterNos: expandRange("7376251ME137", "7376251ME156"), Time: "09:00 AM – 12:00 PM"},
		// S.No 34: B.Tech. BT - 22HS005 (19 candidates)
		{HallNo: "SF 103", CourseCode: "22HS005", RegisterNos: expandRange("7376252BT206", "7376252BT224"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: SF 201 ---
		// S.No 35: B.E. EI - 22HS005 (20 candidates)
		{HallNo: "SF 201", CourseCode: "22HS005", RegisterNos: expandRange("7376251EI102", "7376251EI121"), Time: "09:00 AM – 12:00 PM"},
		// S.No 36: B.E. ME - 22HS005 (10 candidates)
		{HallNo: "SF 201", CourseCode: "22HS005", RegisterNos: append(append(expandRange("7376251ME157", "7376251ME160"), []string{"7376261ME501", "7376261ME502"}...), expandRange("7376261ME504", "7376261ME507")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 37: B.Tech. AG - 22HS005 (10 candidates)
		{HallNo: "SF 201", CourseCode: "22HS005", RegisterNos: expandRange("7376252AG101", "7376252AG110"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: SF 202 ---
		// S.No 38: B.E. EI - 22HS005 (24 candidates)
		{HallNo: "SF 202", CourseCode: "22HS005", RegisterNos: append(expandRange("7376251EI122", "7376251EI133"), expandRange("7376251EI135", "7376251EI146")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 39: B.Tech. AG - 22HS005 (16 candidates)
		{HallNo: "SF 202", CourseCode: "22HS005", RegisterNos: append(expandRange("7376252AG111", "7376252AG113"), expandRange("7376252AG115", "7376252AG127")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: SF 203 ---
		// S.No 40: B.E. EI - 22HS005 (20 candidates)
		{HallNo: "SF 203", CourseCode: "22HS005", RegisterNos: append(expandRange("7376251EI147", "7376251EI161"), expandRange("7376261EI501", "7376261EI505")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: SF B01 ---
		// S.No 41: B.E. EE - 22HS005 (20 candidates)
		{HallNo: "SF B01", CourseCode: "22HS005", RegisterNos: expandRange("7376251EE184", "7376251EE203"), Time: "09:00 AM – 12:00 PM"},
		// S.No 42: B.Tech. AL - 22HS005 (20 candidates)
		{HallNo: "SF B01", CourseCode: "22HS005", RegisterNos: expandRange("7376252AL217", "7376252AL236"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: SF B02 ---
		// S.No 43: B.E. EE - 22HS005 (19 candidates)
		{HallNo: "SF B02", CourseCode: "22HS005", RegisterNos: append([]string{"7376251EE204", "7376251EE205"}, expandRange("7376261EE502", "7376261EE518")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 44: B.E. MZ - 22HS005 (1 candidates)
		{HallNo: "SF B02", CourseCode: "22HS005", RegisterNos: []string{"7376251MZ101"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 45: B.Tech. BT - 22HS005 (1 candidates)
		{HallNo: "SF B02", CourseCode: "22HS005", RegisterNos: []string{"7376252BT102"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 46: B.Tech. AL - 22HS005 (19 candidates)
		{HallNo: "SF B02", CourseCode: "22HS005", RegisterNos: append(expandRange("7376252AL237", "7376252AL246"), expandRange("7376262AL501", "7376262AL509")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: SF B03 ---
		// S.No 47: B.E. MZ - 22HS005 (20 candidates)
		{HallNo: "SF B03", CourseCode: "22HS005", RegisterNos: expandRange("7376251MZ102", "7376251MZ121"), Time: "09:00 AM – 12:00 PM"},
		// S.No 48: B.Tech. BT - 22HS005 (20 candidates)
		{HallNo: "SF B03", CourseCode: "22HS005", RegisterNos: expandRange("7376252BT103", "7376252BT122"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 008 ---
		// S.No 49: B.E. EC - 22HS005 (10 candidates)
		{HallNo: "WW 008", CourseCode: "22HS005", RegisterNos: expandRange("7376251EC163", "7376251EC172"), Time: "09:00 AM – 12:00 PM"},
		// S.No 50: B.Tech. IT - 22HS005 (15 candidates)
		{HallNo: "WW 008", CourseCode: "22HS005", RegisterNos: expandRange("7376252IT184", "7376252IT198"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 011 ---
		// S.No 51: B.E. EC - 22HS005 (10 candidates)
		{HallNo: "WW 011", CourseCode: "22HS005", RegisterNos: expandRange("7376251EC208", "7376251EC217"), Time: "09:00 AM – 12:00 PM"},
		// S.No 52: B.Tech. IT - 22HS005 (15 candidates)
		{HallNo: "WW 011", CourseCode: "22HS005", RegisterNos: expandRange("7376252IT239", "7376252IT253"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 012 ---
		// S.No 53: B.E. EC - 22HS005 (10 candidates)
		{HallNo: "WW 012", CourseCode: "22HS005", RegisterNos: expandRange("7376251EC228", "7376251EC237"), Time: "09:00 AM – 12:00 PM"},
		// S.No 54: B.Tech. IT - 22HS005 (15 candidates)
		{HallNo: "WW 012", CourseCode: "22HS005", RegisterNos: expandRange("7376252IT269", "7376252IT283"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 113 ---
		// S.No 55: B.E. CS - 22HS005 (15 candidates)
		{HallNo: "WW 113", CourseCode: "22HS005", RegisterNos: expandRange("7376251CS380", "7376251CS394"), Time: "09:00 AM – 12:00 PM"},
		// S.No 56: B.Tech. AD - 22HS005 (10 candidates)
		{HallNo: "WW 113", CourseCode: "22HS005", RegisterNos: expandRange("7376252AD321", "7376252AD330"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 114 ---
		// S.No 57: B.E. CS - 22HS005 (15 candidates)
		{HallNo: "WW 114", CourseCode: "22HS005", RegisterNos: expandRange("7376251CS395", "7376251CS409"), Time: "09:00 AM – 12:00 PM"},
		// S.No 58: B.Tech. AD - 22HS005 (10 candidates)
		{HallNo: "WW 114", CourseCode: "22HS005", RegisterNos: expandRange("7376252AD331", "7376252AD340"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 115 ---
		// S.No 59: B.E. CS - 22HS005 (15 candidates)
		{HallNo: "WW 115", CourseCode: "22HS005", RegisterNos: expandRange("7376251CS410", "7376251CS424"), Time: "09:00 AM – 12:00 PM"},
		// S.No 60: B.Tech. AD - 22HS005 (10 candidates)
		{HallNo: "WW 115", CourseCode: "22HS005", RegisterNos: expandRange("7376252AD341", "7376252AD350"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 117 ---
		// S.No 61: B.E. CS - 22HS005 (15 candidates)
		{HallNo: "WW 117", CourseCode: "22HS005", RegisterNos: expandRange("7376251CS425", "7376251CS439"), Time: "09:00 AM – 12:00 PM"},
		// S.No 62: B.Tech. AD - 22HS005 (10 candidates)
		{HallNo: "WW 117", CourseCode: "22HS005", RegisterNos: expandRange("7376252AD351", "7376252AD360"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 118 ---
		// S.No 63: B.E. CS - 22HS005 (15 candidates)
		{HallNo: "WW 118", CourseCode: "22HS005", RegisterNos: expandRange("7376251CS440", "7376251CS454"), Time: "09:00 AM – 12:00 PM"},
		// S.No 64: B.Tech. AD - 22HS005 (10 candidates)
		{HallNo: "WW 118", CourseCode: "22HS005", RegisterNos: expandRange("7376252AD361", "7376252AD370"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 202 ---
		// S.No 65: B.E. CS - 22HS005 (25 candidates)
		{HallNo: "WW 202", CourseCode: "22HS005", RegisterNos: expandRange("7376251CS455", "7376251CS479"), Time: "09:00 AM – 12:00 PM"},
		// S.No 66: B.Tech. AD - 22HS005 (25 candidates)
		{HallNo: "WW 202", CourseCode: "22HS005", RegisterNos: append(expandRange("7376252AD371", "7376252AD381"), expandRange("7376262AD501", "7376262AD514")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 203 ---
		// S.No 67: B.E. CS - 22HS005 (15 candidates)
		{HallNo: "WW 203", CourseCode: "22HS005", RegisterNos: append(expandRange("7376261CS501", "7376261CS514"), []string{"7376261CS516"}...), Time: "09:00 AM – 12:00 PM"},
		// S.No 68: B.E. EC - 22HS005 (2 candidates)
		{HallNo: "WW 203", CourseCode: "22HS005", RegisterNos: []string{"7376251EC101", "7376251EC102"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 69: B.Tech. AD - 22HS005 (8 candidates)
		{HallNo: "WW 203", CourseCode: "22HS005", RegisterNos: expandRange("7376262AD515", "7376262AD522"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 204 ---
		// S.No 70: B.E. EC - 22HS005 (10 candidates)
		{HallNo: "WW 204", CourseCode: "22HS005", RegisterNos: expandRange("7376251EC113", "7376251EC122"), Time: "09:00 AM – 12:00 PM"},
		// S.No 71: B.Tech. IT - 22HS005 (15 candidates)
		{HallNo: "WW 204", CourseCode: "22HS005", RegisterNos: expandRange("7376252IT109", "7376252IT123"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 205 ---
		// S.No 72: B.E. EC - 22HS005 (10 candidates)
		{HallNo: "WW 205", CourseCode: "22HS005", RegisterNos: expandRange("7376251EC133", "7376251EC142"), Time: "09:00 AM – 12:00 PM"},
		// S.No 73: B.Tech. IT - 22HS005 (15 candidates)
		{HallNo: "WW 205", CourseCode: "22HS005", RegisterNos: expandRange("7376252IT139", "7376252IT153"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 206 ---
		// S.No 74: B.E. EC - 22HS005 (10 candidates)
		{HallNo: "WW 206", CourseCode: "22HS005", RegisterNos: expandRange("7376251EC173", "7376251EC182"), Time: "09:00 AM – 12:00 PM"},
		// S.No 75: B.Tech. IT - 22HS005 (15 candidates)
		{HallNo: "WW 206", CourseCode: "22HS005", RegisterNos: expandRange("7376252IT199", "7376252IT213"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 207 ---
		// S.No 76: B.E. EC - 22HS005 (25 candidates)
		{HallNo: "WW 207", CourseCode: "22HS005", RegisterNos: expandRange("7376251EC183", "7376251EC207"), Time: "09:00 AM – 12:00 PM"},
		// S.No 77: B.Tech. IT - 22HS005 (25 candidates)
		{HallNo: "WW 207", CourseCode: "22HS005", RegisterNos: expandRange("7376252IT214", "7376252IT238"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 208 ---
		// S.No 78: B.E. EC - 22HS005 (10 candidates)
		{HallNo: "WW 208", CourseCode: "22HS005", RegisterNos: expandRange("7376251EC218", "7376251EC227"), Time: "09:00 AM – 12:00 PM"},
		// S.No 79: B.Tech. IT - 22HS005 (15 candidates)
		{HallNo: "WW 208", CourseCode: "22HS005", RegisterNos: expandRange("7376252IT254", "7376252IT268"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 209 ---
		// S.No 80: B.E. EC - 22HS005 (10 candidates)
		{HallNo: "WW 209", CourseCode: "22HS005", RegisterNos: expandRange("7376251EC238", "7376251EC247"), Time: "09:00 AM – 12:00 PM"},
		// S.No 81: B.Tech. IT - 22HS005 (15 candidates)
		{HallNo: "WW 209", CourseCode: "22HS005", RegisterNos: expandRange("7376252IT284", "7376252IT298"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 210 ---
		// S.No 82: B.E. EC - 22HS005 (10 candidates)
		{HallNo: "WW 210", CourseCode: "22HS005", RegisterNos: expandRange("7376251EC248", "7376251EC257"), Time: "09:00 AM – 12:00 PM"},
		// S.No 83: B.Tech. IT - 22HS005 (15 candidates)
		{HallNo: "WW 210", CourseCode: "22HS005", RegisterNos: expandRange("7376252IT299", "7376252IT313"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 211 ---
		// S.No 84: B.E. CS - 22HS005 (8 candidates)
		{HallNo: "WW 211", CourseCode: "22HS005", RegisterNos: expandRange("7376261CS517", "7376261CS524"), Time: "09:00 AM – 12:00 PM"},
		// S.No 85: B.E. EC - 22HS005 (10 candidates)
		{HallNo: "WW 211", CourseCode: "22HS005", RegisterNos: expandRange("7376251EC103", "7376251EC112"), Time: "09:00 AM – 12:00 PM"},
		// S.No 86: B.Tech. IT - 22HS005 (7 candidates)
		{HallNo: "WW 211", CourseCode: "22HS005", RegisterNos: expandRange("7376252IT102", "7376252IT108"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 212 ---
		// S.No 87: B.E. EE - 22HS005 (25 candidates)
		{HallNo: "WW 212", CourseCode: "22HS005", RegisterNos: expandRange("7376251EE159", "7376251EE183"), Time: "09:00 AM – 12:00 PM"},
		// S.No 88: B.Tech. AL - 22HS005 (25 candidates)
		{HallNo: "WW 212", CourseCode: "22HS005", RegisterNos: expandRange("7376252AL192", "7376252AL216"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 213 ---
		// S.No 89: B.E. EC - 22HS005 (10 candidates)
		{HallNo: "WW 213", CourseCode: "22HS005", RegisterNos: expandRange("7376251EC123", "7376251EC132"), Time: "09:00 AM – 12:00 PM"},
		// S.No 90: B.Tech. IT - 22HS005 (15 candidates)
		{HallNo: "WW 213", CourseCode: "22HS005", RegisterNos: expandRange("7376252IT124", "7376252IT138"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 214 ---
		// S.No 91: B.E. EC - 22HS005 (10 candidates)
		{HallNo: "WW 214", CourseCode: "22HS005", RegisterNos: expandRange("7376251EC143", "7376251EC152"), Time: "09:00 AM – 12:00 PM"},
		// S.No 92: B.Tech. IT - 22HS005 (15 candidates)
		{HallNo: "WW 214", CourseCode: "22HS005", RegisterNos: expandRange("7376252IT154", "7376252IT168"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 215 ---
		// S.No 93: B.E. EC - 22HS005 (10 candidates)
		{HallNo: "WW 215", CourseCode: "22HS005", RegisterNos: expandRange("7376251EC153", "7376251EC162"), Time: "09:00 AM – 12:00 PM"},
		// S.No 94: B.Tech. IT - 22HS005 (15 candidates)
		{HallNo: "WW 215", CourseCode: "22HS005", RegisterNos: expandRange("7376252IT169", "7376252IT183"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 218 ---
		// S.No 95: B.E. EC - 22HS005 (10 candidates)
		{HallNo: "WW 218", CourseCode: "22HS005", RegisterNos: expandRange("7376251EC258", "7376251EC267"), Time: "09:00 AM – 12:00 PM"},
		// S.No 96: B.Tech. IT - 22HS005 (15 candidates)
		{HallNo: "WW 218", CourseCode: "22HS005", RegisterNos: expandRange("7376252IT314", "7376252IT328"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 219 ---
		// S.No 97: B.E. EC - 22HS005 (10 candidates)
		{HallNo: "WW 219", CourseCode: "22HS005", RegisterNos: append([]string{"7376251EC268", "7376251EC269"}, expandRange("7376251EC271", "7376251EC278")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 98: B.Tech. IT - 22HS005 (15 candidates)
		{HallNo: "WW 219", CourseCode: "22HS005", RegisterNos: append(expandRange("7376252IT329", "7376252IT336"), expandRange("7376252IT338", "7376252IT344")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 222 ---
		// S.No 99: B.E. EC - 22HS005 (25 candidates)
		{HallNo: "WW 222", CourseCode: "22HS005", RegisterNos: expandRange("7376251EC279", "7376251EC303"), Time: "09:00 AM – 12:00 PM"},
		// S.No 100: B.Tech. IT - 22HS005 (25 candidates)
		{HallNo: "WW 222", CourseCode: "22HS005", RegisterNos: expandRange("7376252IT345", "7376252IT369"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 223 ---
		// S.No 101: B.E. EC - 22HS005 (25 candidates)
		{HallNo: "WW 223", CourseCode: "22HS005", RegisterNos: expandRange("7376251EC304", "7376251EC328"), Time: "09:00 AM – 12:00 PM"},
		// S.No 102: B.Tech. IT - 22HS005 (25 candidates)
		{HallNo: "WW 223", CourseCode: "22HS005", RegisterNos: append(expandRange("7376252IT370", "7376252IT388"), expandRange("7376262IT502", "7376262IT507")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 224 ---
		// S.No 103: B.E. EC - 22HS005 (25 candidates)
		{HallNo: "WW 224", CourseCode: "22HS005", RegisterNos: append(expandRange("7376251EC329", "7376251EC352"), []string{"7376261EC502"}...), Time: "09:00 AM – 12:00 PM"},
		// S.No 104: B.Tech. IT - 22HS005 (9 candidates)
		{HallNo: "WW 224", CourseCode: "22HS005", RegisterNos: expandRange("7376262IT508", "7376262IT516"), Time: "09:00 AM – 12:00 PM"},
		// S.No 105: B.Tech. AL - 22HS005 (16 candidates)
		{HallNo: "WW 224", CourseCode: "22HS005", RegisterNos: expandRange("7376252AL101", "7376252AL116"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 225 ---
		// S.No 106: B.E. EC - 22HS005 (18 candidates)
		{HallNo: "WW 225", CourseCode: "22HS005", RegisterNos: expandRange("7376261EC503", "7376261EC520"), Time: "09:00 AM – 12:00 PM"},
		// S.No 107: B.E. EE - 22HS005 (7 candidates)
		{HallNo: "WW 225", CourseCode: "22HS005", RegisterNos: expandRange("7376251EE102", "7376251EE108"), Time: "09:00 AM – 12:00 PM"},
		// S.No 108: B.Tech. AL - 22HS005 (25 candidates)
		{HallNo: "WW 225", CourseCode: "22HS005", RegisterNos: expandRange("7376252AL117", "7376252AL141"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 226 ---
		// S.No 109: B.E. EE - 22HS005 (25 candidates)
		{HallNo: "WW 226", CourseCode: "22HS005", RegisterNos: expandRange("7376251EE109", "7376251EE133"), Time: "09:00 AM – 12:00 PM"},
		// S.No 110: B.Tech. AL - 22HS005 (25 candidates)
		{HallNo: "WW 226", CourseCode: "22HS005", RegisterNos: expandRange("7376252AL142", "7376252AL166"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 227 ---
		// S.No 111: B.E. EE - 22HS005 (25 candidates)
		{HallNo: "WW 227", CourseCode: "22HS005", RegisterNos: expandRange("7376251EE134", "7376251EE158"), Time: "09:00 AM – 12:00 PM"},
		// S.No 112: B.Tech. AL - 22HS005 (25 candidates)
		{HallNo: "WW 227", CourseCode: "22HS005", RegisterNos: expandRange("7376252AL167", "7376252AL191"), Time: "09:00 AM – 12:00 PM"},
	}
}

func buildSeatingData16Nov2026FN() []studentmodels.SeatingRecord {
	return []studentmodels.SeatingRecord{
		// --- Hall: WW 202 ---
		// S.No 1: B.E. CD - 22CD007 (25 candidates)
		{HallNo: "WW 202", CourseCode: "22CD007", RegisterNos: append(expandRange("7376231CD102", "7376231CD115"), expandRange("7376231CD117", "7376231CD127")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 2: B.Tech. AL - 22AM001 (25 candidates)
		{HallNo: "WW 202", CourseCode: "22AM001", RegisterNos: append(append([]string{
			"7376232AL103", "7376232AL104", "7376232AL110", "7376232AL114",
			"7376232AL116", "7376232AL117", "7376232AL119", "7376232AL120",
			"7376232AL124", "7376232AL126", "7376232AL127", "7376232AL129",
			"7376232AL131", "7376232AL132",
		}, expandRange("7376232AL134", "7376232AL138")...), []string{
			"7376232AL141", "7376232AL142", "7376232AL144", "7376232AL146",
			"7376232AL148", "7376232AL149",
		}...), Time: "09:00 AM – 12:00 PM"},

		// --- Hall: WW 203 ---
		// S.No 3: B.E. CD - 22CD007 (10 candidates)
		{HallNo: "WW 203", CourseCode: "22CD007", RegisterNos: expandRange("7376231CD128", "7376231CD137"), Time: "09:00 AM – 12:00 PM"},
		// S.No 4: B.Tech. AL - 22AM001 (15 candidates)
		{HallNo: "WW 203", CourseCode: "22AM001", RegisterNos: append(append(expandRange("7376232AL153", "7376232AL158"), []string{
			"7376232AL162", "7376232AL165", "7376232AL169",
		}...), append(expandRange("7376232AL172", "7376232AL175"), []string{
			"7376232AL177", "7376232AL178",
		}...)...), Time: "09:00 AM – 12:00 PM"},

		// --- Hall: WW 204 ---
		// S.No 5: B.E. CD - 22CD007 (10 candidates)
		{HallNo: "WW 204", CourseCode: "22CD007", RegisterNos: expandRange("7376231CD138", "7376231CD147"), Time: "09:00 AM – 12:00 PM"},
		// S.No 6: B.Tech. AL - 22AM001 (15 candidates)
		{HallNo: "WW 204", CourseCode: "22AM001", RegisterNos: append(append(append(append([]string{
			"7376232AL179",
		}, expandRange("7376232AL186", "7376232AL188")...), []string{
			"7376232AL191", "7376232AL193", "7376232AL198",
		}...), expandRange("7376232AL201", "7376232AL203")...), []string{
			"7376232AL205", "7376232AL206", "7376232AL210", "7376232AL211", "7376232AL213",
		}...), Time: "09:00 AM – 12:00 PM"},

		// --- Hall: WW 205 ---
		// S.No 7: B.E. CD - 22CD007 (14 candidates)
		{HallNo: "WW 205", CourseCode: "22CD007", RegisterNos: append(append(append(expandRange("7376231CD148", "7376231CD152"), []string{"7376231CD154"}...), append(expandRange("7376231CD156", "7376231CD158"), []string{"7376231CD161", "7376231CD162"}...)...), expandRange("7376241CD501", "7376241CD503")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 8: B.Tech. AL - 22AM001 (11 candidates)
		{HallNo: "WW 205", CourseCode: "22AM001", RegisterNos: append([]string{
			"7376232AL215", "7376232AL217", "7376232AL220", "7376232AL221",
		}, expandRange("7376242AL501", "7376242AL507")...), Time: "09:00 AM – 12:00 PM"},
	}
}

func buildSeatingData16Nov2026AN() []studentmodels.SeatingRecord {
	return []studentmodels.SeatingRecord{
		// --- Hall: ME 102 ---
		// S.No 1: B.E. CS - 22CS501 (25 candidates)
		{HallNo: "ME 102", CourseCode: "22CS501", RegisterNos: expandRange("7376241CS102", "7376241CS126"), Time: "01:30 PM – 04:30 PM"},
		// S.No 2: B.E. EC - 22EC501 (20 candidates)
		{HallNo: "ME 102", CourseCode: "22EC501", RegisterNos: append(append(expandRange("7376241EC103", "7376241EC110"), []string{"7376241EC112", "7376241EC113"}...), expandRange("7376241EC115", "7376241EC124")...), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: ME 107 ---
		// S.No 3: B.E. CS - 22CS501 (25 candidates)
		{HallNo: "ME 107", CourseCode: "22CS501", RegisterNos: expandRange("7376241CS127", "7376241CS151"), Time: "01:30 PM – 04:30 PM"},
		// S.No 4: B.E. EC - 22EC501 (20 candidates)
		{HallNo: "ME 107", CourseCode: "22EC501", RegisterNos: expandRange("7376241EC125", "7376241EC144"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: ME 201 ---
		// S.No 5: B.E. CS - 22CS501 (25 candidates)
		{HallNo: "ME 201", CourseCode: "22CS501", RegisterNos: append(expandRange("7376241CS152", "7376241CS157"), expandRange("7376241CS159", "7376241CS177")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 6: B.E. EC - 22EC501 (20 candidates)
		{HallNo: "ME 201", CourseCode: "22EC501", RegisterNos: expandRange("7376241EC145", "7376241EC164"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: ME 202 ---
		// S.No 7: B.E. CS - 22CS501 (25 candidates)
		{HallNo: "ME 202", CourseCode: "22CS501", RegisterNos: append(expandRange("7376241CS178", "7376241CS188"), expandRange("7376241CS190", "7376241CS203")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 8: B.E. EC - 22EC501 (20 candidates)
		{HallNo: "ME 202", CourseCode: "22EC501", RegisterNos: append(expandRange("7376241EC165", "7376241EC174"), expandRange("7376241EC176", "7376241EC185")...), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: ME 203 ---
		// S.No 9: B.E. CS - 22CS501 (25 candidates)
		{HallNo: "ME 203", CourseCode: "22CS501", RegisterNos: expandRange("7376241CS204", "7376241CS228"), Time: "01:30 PM – 04:30 PM"},
		// S.No 10: B.E. EC - 22EC501 (20 candidates)
		{HallNo: "ME 203", CourseCode: "22EC501", RegisterNos: expandRange("7376241EC186", "7376241EC205"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: ME 204 ---
		// S.No 11: B.E. CS - 22CS501 (25 candidates)
		{HallNo: "ME 204", CourseCode: "22CS501", RegisterNos: expandRange("7376241CS230", "7376241CS254"), Time: "01:30 PM – 04:30 PM"},
		// S.No 12: B.E. EC - 22EC501 (20 candidates)
		{HallNo: "ME 204", CourseCode: "22EC501", RegisterNos: append([]string{"7376241EC206", "7376241EC207"}, expandRange("7376241EC209", "7376241EC226")...), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: ME 205 ---
		// S.No 13: B.E. CS - 22CS501 (25 candidates)
		{HallNo: "ME 205", CourseCode: "22CS501", RegisterNos: expandRange("7376241CS255", "7376241CS279"), Time: "01:30 PM – 04:30 PM"},
		// S.No 14: B.E. EC - 22EC501 (20 candidates)
		{HallNo: "ME 205", CourseCode: "22EC501", RegisterNos: append(expandRange("7376241EC227", "7376241EC230"), expandRange("7376241EC232", "7376241EC247")...), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: ME 206 ---
		// S.No 15: B.E. CS - 22CS501 (25 candidates)
		{HallNo: "ME 206", CourseCode: "22CS501", RegisterNos: expandRange("7376241CS280", "7376241CS304"), Time: "01:30 PM – 04:30 PM"},
		// S.No 16: B.E. EC - 22EC501 (20 candidates)
		{HallNo: "ME 206", CourseCode: "22EC501", RegisterNos: expandRange("7376241EC248", "7376241EC267"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: ME 301 ---
		// S.No 17: B.E. CS - 22CS501 (25 candidates)
		{HallNo: "ME 301", CourseCode: "22CS501", RegisterNos: expandRange("7376241CS305", "7376241CS329"), Time: "01:30 PM – 04:30 PM"},
		// S.No 18: B.E. EC - 22EC501 (20 candidates)
		{HallNo: "ME 301", CourseCode: "22EC501", RegisterNos: expandRange("7376241EC268", "7376241EC287"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: ME 302 ---
		// S.No 19: B.E. CS - 22CS501 (25 candidates)
		{HallNo: "ME 302", CourseCode: "22CS501", RegisterNos: append(expandRange("7376241CS330", "7376241CS353"), "7376241CS355"), Time: "01:30 PM – 04:30 PM"},
		// S.No 20: B.E. EC - 22EC501 (20 candidates)
		{HallNo: "ME 302", CourseCode: "22EC501", RegisterNos: expandRange("7376241EC288", "7376241EC307"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: ME 303 ---
		// S.No 21: B.E. CS - 22CS501 (25 candidates)
		{HallNo: "ME 303", CourseCode: "22CS501", RegisterNos: expandRange("7376241CS356", "7376241CS380"), Time: "01:30 PM – 04:30 PM"},
		// S.No 22: B.E. EC - 22EC501 (20 candidates)
		{HallNo: "ME 303", CourseCode: "22EC501", RegisterNos: expandRange("7376241EC308", "7376241EC327"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: ME 304 ---
		// S.No 23: B.E. CS - 22CS501 (25 candidates)
		{HallNo: "ME 304", CourseCode: "22CS501", RegisterNos: expandRange("7376241CS381", "7376241CS405"), Time: "01:30 PM – 04:30 PM"},
		// S.No 24: B.E. EC - 22EC501 (20 candidates)
		{HallNo: "ME 304", CourseCode: "22EC501", RegisterNos: expandRange("7376241EC328", "7376241EC347"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: ME 305 ---
		// S.No 25: B.E. CS - 22CS501 (25 candidates)
		{HallNo: "ME 305", CourseCode: "22CS501", RegisterNos: expandRange("7376241CS406", "7376241CS430"), Time: "01:30 PM – 04:30 PM"},
		// S.No 26: B.E. EC - 22EC501 (20 candidates)
		{HallNo: "ME 305", CourseCode: "22EC501", RegisterNos: append(expandRange("7376241EC348", "7376241EC352"), expandRange("7376251EC501", "7376251EC515")...), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: MH 303 ---
		// S.No 27: B.E. CS - 22CS501 (15 candidates)
		{HallNo: "MH 303", CourseCode: "22CS501", RegisterNos: append(expandRange("7376241CS431", "7376241CS442"), expandRange("7376241CS444", "7376241CS446")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 28: B.E. EC - 22EC501 (6 candidates)
		{HallNo: "MH 303", CourseCode: "22EC501", RegisterNos: expandRange("7376251EC516", "7376251EC521"), Time: "01:30 PM – 04:30 PM"},
		// S.No 29: B.Tech. AD - 22AI501 (4 candidates)
		{HallNo: "MH 303", CourseCode: "22AI501", RegisterNos: expandRange("7376242AD102", "7376242AD105"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: MH 305 ---
		// S.No 30: B.E. CS - 22CS501 (15 candidates)
		{HallNo: "MH 305", CourseCode: "22CS501", RegisterNos: expandRange("7376241CS447", "7376241CS461"), Time: "01:30 PM – 04:30 PM"},
		// S.No 31: B.Tech. AD - 22AI501 (10 candidates)
		{HallNo: "MH 305", CourseCode: "22AI501", RegisterNos: expandRange("7376242AD106", "7376242AD115"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: SF 001 ---
		// S.No 32: B.E. EI - 22EI501 (16 candidates)
		{HallNo: "SF 001", CourseCode: "22EI501", RegisterNos: append(expandRange("7376241EI147", "7376241EI160"), []string{"7376251EI501", "7376251EI502"}...), Time: "01:30 PM – 04:30 PM"},
		// S.No 33: B.E. ME - 22ME501 (20 candidates)
		{HallNo: "SF 001", CourseCode: "22ME501", RegisterNos: append(expandRange("7376241ME130", "7376241ME132"), expandRange("7376241ME134", "7376241ME150")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 34: B.Tech. AG - 22AG501 (4 candidates)
		{HallNo: "SF 001", CourseCode: "22AG501", RegisterNos: expandRange("7376242AG101", "7376242AG104"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: SF 002 ---
		// S.No 35: B.E. ME - 22ME501 (17 candidates)
		{HallNo: "SF 002", CourseCode: "22ME501", RegisterNos: append(expandRange("7376241ME151", "7376241ME159"), expandRange("7376251ME501", "7376251ME508")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 36: B.Tech. CB - 22CB501 (3 candidates)
		{HallNo: "SF 002", CourseCode: "22CB501", RegisterNos: expandRange("7376242CB102", "7376242CB104"), Time: "01:30 PM – 04:30 PM"},
		// S.No 37: B.Tech. AG - 22AG501 (20 candidates)
		{HallNo: "SF 002", CourseCode: "22AG501", RegisterNos: expandRange("7376242AG105", "7376242AG124"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: SF 101 ---
		// S.No 38: B.Tech. CB - 22CB501 (38 candidates)
		{HallNo: "SF 101", CourseCode: "22CB501", RegisterNos: append([]string{"7376242CB105"}, expandRange("7376242CB107", "7376242CB143")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 39: B.Tech. AG - 22AG501 (2 candidates)
		{HallNo: "SF 101", CourseCode: "22AG501", RegisterNos: []string{"7376252AG501", "7376252AG502"}, Time: "01:30 PM – 04:30 PM"},

		// --- Hall: SF 102 ---
		// S.No 40: B.Tech. CB - 22CB501 (19 candidates)
		{HallNo: "SF 102", CourseCode: "22CB501", RegisterNos: append(expandRange("7376242CB144", "7376242CB159"), expandRange("7376252CB501", "7376252CB503")...), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: SF B01 ---
		// S.No 41: B.E. EI - 22EI501 (5 candidates)
		{HallNo: "SF B01", CourseCode: "22EI501", RegisterNos: expandRange("7376241EI101", "7376241EI105"), Time: "01:30 PM – 04:30 PM"},
		// S.No 42: B.E. MZ - 22MC501 (15 candidates)
		{HallNo: "SF B01", CourseCode: "22MC501", RegisterNos: append(expandRange("7376241MZ152", "7376241MZ160"), expandRange("7376251MZ501", "7376251MZ506")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 43: B.Tech. BT - 22BT501 (20 candidates)
		{HallNo: "SF B01", CourseCode: "22BT501", RegisterNos: expandRange("7376242BT190", "7376242BT209"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: SF B02 ---
		// S.No 44: B.E. EI - 22EI501 (20 candidates)
		{HallNo: "SF B02", CourseCode: "22EI501", RegisterNos: expandRange("7376241EI106", "7376241EI125"), Time: "01:30 PM – 04:30 PM"},
		// S.No 45: B.E. ME - 22ME501 (7 candidates)
		{HallNo: "SF B02", CourseCode: "22ME501", RegisterNos: expandRange("7376241ME102", "7376241ME108"), Time: "01:30 PM – 04:30 PM"},
		// S.No 46: B.Tech. BT - 22BT501 (13 candidates)
		{HallNo: "SF B02", CourseCode: "22BT501", RegisterNos: append(append(expandRange("7376242BT210", "7376242BT218"), expandRange("7376242BT220", "7376242BT222")...), "7376252BT501"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: SF B03 ---
		// S.No 47: B.E. EI - 22EI501 (20 candidates)
		{HallNo: "SF B03", CourseCode: "22EI501", RegisterNos: expandRange("7376241EI127", "7376241EI146"), Time: "01:30 PM – 04:30 PM"},
		// S.No 48: B.E. ME - 22ME501 (20 candidates)
		{HallNo: "SF B03", CourseCode: "22ME501", RegisterNos: append([]string{"7376241ME109"}, expandRange("7376241ME111", "7376241ME129")...), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 008 ---
		// S.No 49: B.Tech. IT - 22IT501 (15 candidates)
		{HallNo: "WW 008", CourseCode: "22IT501", RegisterNos: expandRange("7376242IT230", "7376242IT244"), Time: "01:30 PM – 04:30 PM"},
		// S.No 50: B.Tech. AD - 22AI501 (10 candidates)
		{HallNo: "WW 008", CourseCode: "22AI501", RegisterNos: expandRange("7376242AD229", "7376242AD238"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 011 ---
		// S.No 51: B.Tech. IT - 22IT501 (15 candidates)
		{HallNo: "WW 011", CourseCode: "22IT501", RegisterNos: expandRange("7376242IT285", "7376242IT299"), Time: "01:30 PM – 04:30 PM"},
		// S.No 52: B.Tech. AD - 22AI501 (10 candidates)
		{HallNo: "WW 011", CourseCode: "22AI501", RegisterNos: expandRange("7376242AD274", "7376242AD283"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 012 ---
		// S.No 53: B.Tech. IT - 22IT501 (15 candidates)
		{HallNo: "WW 012", CourseCode: "22IT501", RegisterNos: expandRange("7376242IT316", "7376242IT330"), Time: "01:30 PM – 04:30 PM"},
		// S.No 54: B.Tech. AD - 22AI501 (10 candidates)
		{HallNo: "WW 012", CourseCode: "22AI501", RegisterNos: expandRange("7376242AD294", "7376242AD303"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 113 ---
		// S.No 55: B.E. CS - 22CS501 (15 candidates)
		{HallNo: "WW 113", CourseCode: "22CS501", RegisterNos: append(append(expandRange("7376241CS462", "7376241CS469"), expandRange("7376241CS471", "7376241CS476")...), "7376251CS501"), Time: "01:30 PM – 04:30 PM"},
		// S.No 56: B.Tech. AD - 22AI501 (10 candidates)
		{HallNo: "WW 113", CourseCode: "22AI501", RegisterNos: expandRange("7376242AD116", "7376242AD125"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 114 ---
		// S.No 57: B.E. CS - 22CS501 (15 candidates)
		{HallNo: "WW 114", CourseCode: "22CS501", RegisterNos: append(expandRange("7376251CS502", "7376251CS513"), expandRange("7376251CS515", "7376251CS517")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 58: B.Tech. AD - 22AI501 (10 candidates)
		{HallNo: "WW 114", CourseCode: "22AI501", RegisterNos: append(expandRange("7376242AD126", "7376242AD129"), expandRange("7376242AD131", "7376242AD136")...), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 115 ---
		// S.No 59: B.E. CS - 22CS501 (7 candidates)
		{HallNo: "WW 115", CourseCode: "22CS501", RegisterNos: expandRange("7376251CS518", "7376251CS524"), Time: "01:30 PM – 04:30 PM"},
		// S.No 60: B.Tech. IT - 22IT501 (8 candidates)
		{HallNo: "WW 115", CourseCode: "22IT501", RegisterNos: expandRange("7376242IT101", "7376242IT108"), Time: "01:30 PM – 04:30 PM"},
		// S.No 61: B.Tech. AD - 22AI501 (10 candidates)
		{HallNo: "WW 115", CourseCode: "22AI501", RegisterNos: expandRange("7376242AD137", "7376242AD146"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 117 ---
		// S.No 62: B.Tech. IT - 22IT501 (15 candidates)
		{HallNo: "WW 117", CourseCode: "22IT501", RegisterNos: expandRange("7376242IT109", "7376242IT123"), Time: "01:30 PM – 04:30 PM"},
		// S.No 63: B.Tech. AD - 22AI501 (10 candidates)
		{HallNo: "WW 117", CourseCode: "22AI501", RegisterNos: expandRange("7376242AD147", "7376242AD156"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 118 ---
		// S.No 64: B.Tech. IT - 22IT501 (15 candidates)
		{HallNo: "WW 118", CourseCode: "22IT501", RegisterNos: expandRange("7376242IT124", "7376242IT138"), Time: "01:30 PM – 04:30 PM"},
		// S.No 65: B.Tech. AD - 22AI501 (10 candidates)
		{HallNo: "WW 118", CourseCode: "22AI501", RegisterNos: expandRange("7376242AD157", "7376242AD166"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 204 ---
		// S.No 66: B.Tech. IT - 22IT501 (15 candidates)
		{HallNo: "WW 204", CourseCode: "22IT501", RegisterNos: expandRange("7376242IT155", "7376242IT169"), Time: "01:30 PM – 04:30 PM"},
		// S.No 67: B.Tech. AD - 22AI501 (10 candidates)
		{HallNo: "WW 204", CourseCode: "22AI501", RegisterNos: append(expandRange("7376242AD178", "7376242AD186"), "7376242AD188"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 205 ---
		// S.No 68: B.Tech. IT - 22IT501 (15 candidates)
		{HallNo: "WW 205", CourseCode: "22IT501", RegisterNos: expandRange("7376242IT185", "7376242IT199"), Time: "01:30 PM – 04:30 PM"},
		// S.No 69: B.Tech. AD - 22AI501 (10 candidates)
		{HallNo: "WW 205", CourseCode: "22AI501", RegisterNos: expandRange("7376242AD199", "7376242AD208"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 206 ---
		// S.No 70: B.Tech. IT - 22IT501 (15 candidates)
		{HallNo: "WW 206", CourseCode: "22IT501", RegisterNos: expandRange("7376242IT245", "7376242IT259"), Time: "01:30 PM – 04:30 PM"},
		// S.No 71: B.Tech. AD - 22AI501 (10 candidates)
		{HallNo: "WW 206", CourseCode: "22AI501", RegisterNos: expandRange("7376242AD239", "7376242AD248"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 207 ---
		// S.No 72: B.Tech. IT - 22IT501 (25 candidates)
		{HallNo: "WW 207", CourseCode: "22IT501", RegisterNos: expandRange("7376242IT260", "7376242IT284"), Time: "01:30 PM – 04:30 PM"},
		// S.No 73: B.Tech. AD - 22AI501 (25 candidates)
		{HallNo: "WW 207", CourseCode: "22AI501", RegisterNos: expandRange("7376242AD249", "7376242AD273"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 208 ---
		// S.No 74: B.Tech. IT - 22IT501 (15 candidates)
		{HallNo: "WW 208", CourseCode: "22IT501", RegisterNos: append(expandRange("7376242IT300", "7376242IT303"), expandRange("7376242IT305", "7376242IT315")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 75: B.Tech. AD - 22AI501 (10 candidates)
		{HallNo: "WW 208", CourseCode: "22AI501", RegisterNos: expandRange("7376242AD284", "7376242AD293"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 209 ---
		// S.No 76: B.Tech. IT - 22IT501 (15 candidates)
		{HallNo: "WW 209", CourseCode: "22IT501", RegisterNos: expandRange("7376242IT331", "7376242IT345"), Time: "01:30 PM – 04:30 PM"},
		// S.No 77: B.Tech. AD - 22AI501 (10 candidates)
		{HallNo: "WW 209", CourseCode: "22AI501", RegisterNos: expandRange("7376242AD304", "7376242AD313"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 210 ---
		// S.No 78: B.Tech. IT - 22IT501 (15 candidates)
		{HallNo: "WW 210", CourseCode: "22IT501", RegisterNos: append(append(expandRange("7376242IT346", "7376242IT351"), expandRange("7376252IT501", "7376252IT506")...), expandRange("7376252IT508", "7376252IT510")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 79: B.Tech. AD - 22AI501 (10 candidates)
		{HallNo: "WW 210", CourseCode: "22AI501", RegisterNos: expandRange("7376242AD314", "7376242AD323"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 211 ---
		// S.No 80: B.Tech. IT - 22IT501 (15 candidates)
		{HallNo: "WW 211", CourseCode: "22IT501", RegisterNos: expandRange("7376242IT139", "7376242IT153"), Time: "01:30 PM – 04:30 PM"},
		// S.No 81: B.Tech. AD - 22AI501 (10 candidates)
		{HallNo: "WW 211", CourseCode: "22AI501", RegisterNos: append(append(expandRange("7376242AD167", "7376242AD174"), "7376242AD176"), "7376242AD177"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 212 ---
		// S.No 82: B.E. MZ - 22MC501 (25 candidates)
		{HallNo: "WW 212", CourseCode: "22MC501", RegisterNos: expandRange("7376241MZ127", "7376241MZ151"), Time: "01:30 PM – 04:30 PM"},
		// S.No 83: B.Tech. BT - 22BT501 (25 candidates)
		{HallNo: "WW 212", CourseCode: "22BT501", RegisterNos: expandRange("7376242BT165", "7376242BT189"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 213 ---
		// S.No 84: B.Tech. IT - 22IT501 (15 candidates)
		{HallNo: "WW 213", CourseCode: "22IT501", RegisterNos: expandRange("7376242IT170", "7376242IT184"), Time: "01:30 PM – 04:30 PM"},
		// S.No 85: B.Tech. AD - 22AI501 (10 candidates)
		{HallNo: "WW 213", CourseCode: "22AI501", RegisterNos: expandRange("7376242AD189", "7376242AD198"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 214 ---
		// S.No 86: B.Tech. IT - 22IT501 (15 candidates)
		{HallNo: "WW 214", CourseCode: "22IT501", RegisterNos: expandRange("7376242IT200", "7376242IT214"), Time: "01:30 PM – 04:30 PM"},
		// S.No 87: B.Tech. AD - 22AI501 (10 candidates)
		{HallNo: "WW 214", CourseCode: "22AI501", RegisterNos: expandRange("7376242AD209", "7376242AD218"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 215 ---
		// S.No 88: B.Tech. IT - 22IT501 (15 candidates)
		{HallNo: "WW 215", CourseCode: "22IT501", RegisterNos: expandRange("7376242IT215", "7376242IT229"), Time: "01:30 PM – 04:30 PM"},
		// S.No 89: B.Tech. AD - 22AI501 (10 candidates)
		{HallNo: "WW 215", CourseCode: "22AI501", RegisterNos: expandRange("7376242AD219", "7376242AD228"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 218 ---
		// S.No 90: B.E. EE - 22EE501 (9 candidates)
		{HallNo: "WW 218", CourseCode: "22EE501", RegisterNos: expandRange("7376241EE101", "7376241EE109"), Time: "01:30 PM – 04:30 PM"},
		// S.No 91: B.Tech. IT - 22IT501 (6 candidates)
		{HallNo: "WW 218", CourseCode: "22IT501", RegisterNos: expandRange("7376252IT511", "7376252IT516"), Time: "01:30 PM – 04:30 PM"},
		// S.No 92: B.Tech. AD - 22AI501 (10 candidates)
		{HallNo: "WW 218", CourseCode: "22AI501", RegisterNos: expandRange("7376242AD324", "7376242AD333"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 219 ---
		// S.No 93: B.E. EE - 22EE501 (15 candidates)
		{HallNo: "WW 219", CourseCode: "22EE501", RegisterNos: append([]string{"7376241EE110", "7376241EE111"}, expandRange("7376241EE113", "7376241EE125")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 94: B.Tech. AD - 22AI501 (10 candidates)
		{HallNo: "WW 219", CourseCode: "22AI501", RegisterNos: expandRange("7376242AD334", "7376242AD343"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 220 ---
		// S.No 95: B.E. EE - 22EE501 (10 candidates)
		{HallNo: "WW 220", CourseCode: "22EE501", RegisterNos: expandRange("7376241EE126", "7376241EE135"), Time: "01:30 PM – 04:30 PM"},
		// S.No 96: B.Tech. AD - 22AI501 (10 candidates)
		{HallNo: "WW 220", CourseCode: "22AI501", RegisterNos: append(expandRange("7376242AD344", "7376242AD346"), expandRange("7376252AD501", "7376252AD507")...), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 221 ---
		// S.No 97: B.E. EE - 22EE501 (10 candidates)
		{HallNo: "WW 221", CourseCode: "22EE501", RegisterNos: expandRange("7376241EE136", "7376241EE145"), Time: "01:30 PM – 04:30 PM"},
		// S.No 98: B.Tech. AD - 22AI501 (9 candidates)
		{HallNo: "WW 221", CourseCode: "22AI501", RegisterNos: expandRange("7376252AD508", "7376252AD516"), Time: "01:30 PM – 04:30 PM"},
		// S.No 99: B.Tech. AL - 22AM501 (1 candidate)
		{HallNo: "WW 221", CourseCode: "22AM501", RegisterNos: []string{"7376242AL101"}, Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 222 ---
		// S.No 100: B.E. EE - 22EE501 (25 candidates)
		{HallNo: "WW 222", CourseCode: "22EE501", RegisterNos: expandRange("7376241EE146", "7376241EE170"), Time: "01:30 PM – 04:30 PM"},
		// S.No 101: B.Tech. AL - 22AM501 (25 candidates)
		{HallNo: "WW 222", CourseCode: "22AM501", RegisterNos: expandRange("7376242AL102", "7376242AL126"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 223 ---
		// S.No 102: B.E. EE - 22EE501 (25 candidates)
		{HallNo: "WW 223", CourseCode: "22EE501", RegisterNos: append([]string{"7376241EE171"}, expandRange("7376241EE173", "7376241EE196")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 103: B.Tech. AL - 22AM501 (25 candidates)
		{HallNo: "WW 223", CourseCode: "22AM501", RegisterNos: expandRange("7376242AL127", "7376242AL151"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 224 ---
		// S.No 104: B.E. EE - 22EE501 (25 candidates)
		{HallNo: "WW 224", CourseCode: "22EE501", RegisterNos: append(expandRange("7376241EE197", "7376241EE217"), expandRange("7376251EE501", "7376251EE504")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 105: B.Tech. AL - 22AM501 (25 candidates)
		{HallNo: "WW 224", CourseCode: "22AM501", RegisterNos: expandRange("7376242AL152", "7376242AL176"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 225 ---
		// S.No 106: B.E. EE - 22EE501 (13 candidates)
		{HallNo: "WW 225", CourseCode: "22EE501", RegisterNos: expandRange("7376251EE505", "7376251EE517"), Time: "01:30 PM – 04:30 PM"},
		// S.No 107: B.Tech. BT - 22BT501 (12 candidates)
		{HallNo: "WW 225", CourseCode: "22BT501", RegisterNos: expandRange("7376242BT102", "7376242BT113"), Time: "01:30 PM – 04:30 PM"},
		// S.No 108: B.Tech. AL - 22AM501 (25 candidates)
		{HallNo: "WW 225", CourseCode: "22AM501", RegisterNos: expandRange("7376242AL177", "7376242AL201"), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 226 ---
		// S.No 109: B.E. MZ - 22MC501 (1 candidate)
		{HallNo: "WW 226", CourseCode: "22MC501", RegisterNos: []string{"7376241MZ101"}, Time: "01:30 PM – 04:30 PM"},
		// S.No 110: B.Tech. BT - 22BT501 (25 candidates)
		{HallNo: "WW 226", CourseCode: "22BT501", RegisterNos: expandRange("7376242BT114", "7376242BT138"), Time: "01:30 PM – 04:30 PM"},
		// S.No 111: B.Tech. AL - 22AM501 (24 candidates)
		{HallNo: "WW 226", CourseCode: "22AM501", RegisterNos: append(append(expandRange("7376242AL202", "7376242AL206"), expandRange("7376242AL208", "7376242AL223")...), expandRange("7376252AL501", "7376252AL503")...), Time: "01:30 PM – 04:30 PM"},

		// --- Hall: WW 227 ---
		// S.No 112: B.E. MZ - 22MC501 (25 candidates)
		{HallNo: "WW 227", CourseCode: "22MC501", RegisterNos: expandRange("7376241MZ102", "7376241MZ126"), Time: "01:30 PM – 04:30 PM"},
		// S.No 113: B.Tech. BT - 22BT501 (25 candidates)
		{HallNo: "WW 227", CourseCode: "22BT501", RegisterNos: append(expandRange("7376242BT139", "7376242BT160"), expandRange("7376242BT162", "7376242BT164")...), Time: "01:30 PM – 04:30 PM"},
	}
}

// ============================================================================
// 17-11-2026 FORENOON SESSION (09:00 AM – 12:00 PM) - Total: 1889 Students
// ============================================================================
func buildSeatingData17Nov2026FN() []studentmodels.SeatingRecord {
	return []studentmodels.SeatingRecord{
		// --- Hall: ME 102 ---
		// S.No 1: B.E. CS - 22HS004 (25 candidates)
		{HallNo: "ME 102", CourseCode: "22HS004", RegisterNos: expandRange("7376251CS101", "7376251CS125"), Time: "09:00 AM – 12:00 PM"},
		// S.No 2: B.Tech. AD - 22HS004 (20 candidates)
		{HallNo: "ME 102", CourseCode: "22HS004", RegisterNos: expandRange("7376252AD101", "7376252AD120"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: ME 107 ---
		// S.No 3: B.E. CS - 22HS004 (25 candidates)
		{HallNo: "ME 107", CourseCode: "22HS004", RegisterNos: append(expandRange("7376251CS126", "7376251CS128"), expandRange("7376251CS130", "7376251CS151")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 4: B.Tech. AD - 22HS004 (20 candidates)
		{HallNo: "ME 107", CourseCode: "22HS004", RegisterNos: expandRange("7376252AD121", "7376252AD140"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: ME 201 ---
		// S.No 5: B.E. CS - 22HS004 (25 candidates)
		{HallNo: "ME 201", CourseCode: "22HS004", RegisterNos: append(expandRange("7376251CS152", "7376251CS168"), expandRange("7376251CS170", "7376251CS177")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 6: B.Tech. AD - 22HS004 (20 candidates)
		{HallNo: "ME 201", CourseCode: "22HS004", RegisterNos: expandRange("7376252AD141", "7376252AD160"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: ME 202 ---
		// S.No 7: B.E. CS - 22HS004 (25 candidates)
		{HallNo: "ME 202", CourseCode: "22HS004", RegisterNos: expandRange("7376251CS178", "7376251CS202"), Time: "09:00 AM – 12:00 PM"},
		// S.No 8: B.Tech. AD - 22HS004 (20 candidates)
		{HallNo: "ME 202", CourseCode: "22HS004", RegisterNos: expandRange("7376252AD161", "7376252AD180"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: ME 203 ---
		// S.No 9: B.E. CS - 22HS004 (25 candidates)
		{HallNo: "ME 203", CourseCode: "22HS004", RegisterNos: expandRange("7376251CS203", "7376251CS227"), Time: "09:00 AM – 12:00 PM"},
		// S.No 10: B.Tech. AD - 22HS004 (20 candidates)
		{HallNo: "ME 203", CourseCode: "22HS004", RegisterNos: expandRange("7376252AD181", "7376252AD200"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: ME 204 ---
		// S.No 11: B.E. CS - 22HS004 (25 candidates)
		{HallNo: "ME 204", CourseCode: "22HS004", RegisterNos: append([]string{"7376251CS228"}, expandRange("7376251CS230", "7376251CS253")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 12: B.Tech. AD - 22HS004 (20 candidates)
		{HallNo: "ME 204", CourseCode: "22HS004", RegisterNos: expandRange("7376252AD201", "7376252AD220"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: ME 205 ---
		// S.No 13: B.E. CS - 22HS004 (25 candidates)
		{HallNo: "ME 205", CourseCode: "22HS004", RegisterNos: expandRange("7376251CS254", "7376251CS278"), Time: "09:00 AM – 12:00 PM"},
		// S.No 14: B.Tech. AD - 22HS004 (20 candidates)
		{HallNo: "ME 205", CourseCode: "22HS004", RegisterNos: expandRange("7376252AD221", "7376252AD240"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: ME 206 ---
		// S.No 15: B.E. CS - 22HS004 (25 candidates)
		{HallNo: "ME 206", CourseCode: "22HS004", RegisterNos: expandRange("7376251CS279", "7376251CS303"), Time: "09:00 AM – 12:00 PM"},
		// S.No 16: B.Tech. AD - 22HS004 (20 candidates)
		{HallNo: "ME 206", CourseCode: "22HS004", RegisterNos: expandRange("7376252AD241", "7376252AD260"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: ME 301 ---
		// S.No 17: B.E. CS - 22HS004 (25 candidates)
		{HallNo: "ME 301", CourseCode: "22HS004", RegisterNos: expandRange("7376251CS304", "7376251CS328"), Time: "09:00 AM – 12:00 PM"},
		// S.No 18: B.Tech. AD - 22HS004 (20 candidates)
		{HallNo: "ME 301", CourseCode: "22HS004", RegisterNos: expandRange("7376252AD261", "7376252AD280"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: ME 302 ---
		// S.No 19: B.E. CS - 22HS004 (25 candidates)
		{HallNo: "ME 302", CourseCode: "22HS004", RegisterNos: expandRange("7376251CS329", "7376251CS353"), Time: "09:00 AM – 12:00 PM"},
		// S.No 20: B.Tech. AD - 22HS004 (20 candidates)
		{HallNo: "ME 302", CourseCode: "22HS004", RegisterNos: expandRange("7376252AD281", "7376252AD300"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: ME 303 ---
		// S.No 21: B.E. CS - 22HS004 (25 candidates)
		{HallNo: "ME 303", CourseCode: "22HS004", RegisterNos: append(expandRange("7376251CS354", "7376251CS371"), expandRange("7376251CS373", "7376251CS379")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 22: B.Tech. AD - 22HS004 (20 candidates)
		{HallNo: "ME 303", CourseCode: "22HS004", RegisterNos: expandRange("7376252AD301", "7376252AD320"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: ME 304 ---
		// S.No 23: B.E. CS - 22HS004 (25 candidates)
		{HallNo: "ME 304", CourseCode: "22HS004", RegisterNos: expandRange("7376251CS380", "7376251CS404"), Time: "09:00 AM – 12:00 PM"},
		// S.No 24: B.Tech. AD - 22HS004 (20 candidates)
		{HallNo: "ME 304", CourseCode: "22HS004", RegisterNos: expandRange("7376252AD321", "7376252AD340"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: ME 305 ---
		// S.No 25: B.E. CS - 22HS004 (25 candidates)
		{HallNo: "ME 305", CourseCode: "22HS004", RegisterNos: expandRange("7376251CS405", "7376251CS429"), Time: "09:00 AM – 12:00 PM"},
		// S.No 26: B.Tech. AD - 22HS004 (20 candidates)
		{HallNo: "ME 305", CourseCode: "22HS004", RegisterNos: expandRange("7376252AD341", "7376252AD360"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: SF 001 ---
		// S.No 27: B.E. ME - 22HS004 (20 candidates)
		{HallNo: "SF 001", CourseCode: "22HS004", RegisterNos: expandRange("7376251ME118", "7376251ME137"), Time: "09:00 AM – 12:00 PM"},
		// S.No 28: B.Tech. BT - 22HS004 (20 candidates)
		{HallNo: "SF 001", CourseCode: "22HS004", RegisterNos: append(expandRange("7376252BT195", "7376252BT197"), expandRange("7376252BT199", "7376252BT215")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: SF 002 ---
		// S.No 29: B.E. EI - 22HS004 (11 candidates)
		{HallNo: "SF 002", CourseCode: "22HS004", RegisterNos: expandRange("7376251EI101", "7376251EI111"), Time: "09:00 AM – 12:00 PM"},
		// S.No 30: B.E. ME - 22HS004 (20 candidates)
		{HallNo: "SF 002", CourseCode: "22HS004", RegisterNos: expandRange("7376251ME138", "7376251ME157"), Time: "09:00 AM – 12:00 PM"},
		// S.No 31: B.Tech. BT - 22HS004 (9 candidates)
		{HallNo: "SF 002", CourseCode: "22HS004", RegisterNos: expandRange("7376252BT216", "7376252BT224"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: SF 101 ---
		// S.No 32: B.E. EI - 22HS004 (20 candidates)
		{HallNo: "SF 101", CourseCode: "22HS004", RegisterNos: expandRange("7376251EI112", "7376251EI131"), Time: "09:00 AM – 12:00 PM"},
		// S.No 33: B.E. ME - 22HS004 (9 candidates)
		{HallNo: "SF 101", CourseCode: "22HS004", RegisterNos: append(append(expandRange("7376251ME158", "7376251ME160"), []string{"7376261ME501", "7376261ME502"}...), expandRange("7376261ME504", "7376261ME507")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 34: B.Tech. AG - 22HS004 (11 candidates)
		{HallNo: "SF 101", CourseCode: "22HS004", RegisterNos: expandRange("7376252AG101", "7376252AG111"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: SF 102 ---
		// S.No 35: B.E. EI - 22HS004 (25 candidates)
		{HallNo: "SF 102", CourseCode: "22HS004", RegisterNos: append([]string{"7376251EI132", "7376251EI133"}, expandRange("7376251EI135", "7376251EI157")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 36: B.Tech. AG - 22HS004 (15 candidates)
		{HallNo: "SF 102", CourseCode: "22HS004", RegisterNos: append([]string{"7376252AG112", "7376252AG113"}, expandRange("7376252AG115", "7376252AG127")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: SF 103 ---
		// S.No 37: B.E. EI - 22HS004 (9 candidates)
		{HallNo: "SF 103", CourseCode: "22HS004", RegisterNos: append(expandRange("7376251EI158", "7376251EI161"), expandRange("7376261EI501", "7376261EI505")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: SF B01 ---
		// S.No 38: B.E. MZ - 22HS004 (20 candidates)
		{HallNo: "SF B01", CourseCode: "22HS004", RegisterNos: expandRange("7376251MZ123", "7376251MZ142"), Time: "09:00 AM – 12:00 PM"},
		// S.No 39: B.Tech. BT - 22HS004 (20 candidates)
		{HallNo: "SF B01", CourseCode: "22HS004", RegisterNos: expandRange("7376252BT133", "7376252BT152"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: SF B02 ---
		// S.No 40: B.E. MZ - 22HS004 (20 candidates)
		{HallNo: "SF B02", CourseCode: "22HS004", RegisterNos: expandRange("7376251MZ143", "7376251MZ162"), Time: "09:00 AM – 12:00 PM"},
		// S.No 41: B.Tech. BT - 22HS004 (20 candidates)
		{HallNo: "SF B02", CourseCode: "22HS004", RegisterNos: append([]string{"7376252BT153"}, expandRange("7376252BT155", "7376252BT173")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: SF B03 ---
		// S.No 42: B.E. ME - 22HS004 (16 candidates)
		{HallNo: "SF B03", CourseCode: "22HS004", RegisterNos: expandRange("7376251ME102", "7376251ME117"), Time: "09:00 AM – 12:00 PM"},
		// S.No 43: B.E. MZ - 22HS004 (4 candidates)
		{HallNo: "SF B03", CourseCode: "22HS004", RegisterNos: expandRange("7376261MZ502", "7376261MZ505"), Time: "09:00 AM – 12:00 PM"},
		// S.No 44: B.Tech. BT - 22HS004 (20 candidates)
		{HallNo: "SF B03", CourseCode: "22HS004", RegisterNos: append(expandRange("7376252BT174", "7376252BT189"), expandRange("7376252BT191", "7376252BT194")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 008 ---
		// S.No 45: B.E. EC - 22HS004 (10 candidates)
		{HallNo: "WW 008", CourseCode: "22HS004", RegisterNos: expandRange("7376251EC203", "7376251EC212"), Time: "09:00 AM – 12:00 PM"},
		// S.No 46: B.Tech. IT - 22HS004 (15 candidates)
		{HallNo: "WW 008", CourseCode: "22HS004", RegisterNos: expandRange("7376252IT234", "7376252IT248"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 011 ---
		// S.No 47: B.E. EC - 22HS004 (10 candidates)
		{HallNo: "WW 011", CourseCode: "22HS004", RegisterNos: expandRange("7376251EC248", "7376251EC257"), Time: "09:00 AM – 12:00 PM"},
		// S.No 48: B.Tech. IT - 22HS004 (15 candidates)
		{HallNo: "WW 011", CourseCode: "22HS004", RegisterNos: expandRange("7376252IT289", "7376252IT303"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 012 ---
		// S.No 49: B.E. EC - 22HS004 (10 candidates)
		{HallNo: "WW 012", CourseCode: "22HS004", RegisterNos: append([]string{"7376251EC268", "7376251EC269"}, expandRange("7376251EC271", "7376251EC278")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 50: B.Tech. IT - 22HS004 (15 candidates)
		{HallNo: "WW 012", CourseCode: "22HS004", RegisterNos: expandRange("7376252IT319", "7376252IT333"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 113 ---
		// S.No 51: B.E. CS - 22HS004 (15 candidates)
		{HallNo: "WW 113", CourseCode: "22HS004", RegisterNos: expandRange("7376251CS430", "7376251CS444"), Time: "09:00 AM – 12:00 PM"},
		// S.No 52: B.Tech. AD - 22HS004 (10 candidates)
		{HallNo: "WW 113", CourseCode: "22HS004", RegisterNos: expandRange("7376252AD361", "7376252AD370"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 114 ---
		// S.No 53: B.E. CS - 22HS004 (15 candidates)
		{HallNo: "WW 114", CourseCode: "22HS004", RegisterNos: expandRange("7376251CS445", "7376251CS459"), Time: "09:00 AM – 12:00 PM"},
		// S.No 54: B.Tech. AD - 22HS004 (10 candidates)
		{HallNo: "WW 114", CourseCode: "22HS004", RegisterNos: expandRange("7376252AD371", "7376252AD380"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 115 ---
		// S.No 55: B.E. CS - 22HS004 (15 candidates)
		{HallNo: "WW 115", CourseCode: "22HS004", RegisterNos: expandRange("7376251CS460", "7376251CS474"), Time: "09:00 AM – 12:00 PM"},
		// S.No 56: B.Tech. AD - 22HS004 (10 candidates)
		{HallNo: "WW 115", CourseCode: "22HS004", RegisterNos: append([]string{"7376252AD381"}, expandRange("7376262AD501", "7376262AD509")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 117 ---
		// S.No 57: B.E. CS - 22HS004 (15 candidates)
		{HallNo: "WW 117", CourseCode: "22HS004", RegisterNos: append(expandRange("7376251CS475", "7376251CS479"), expandRange("7376261CS501", "7376261CS510")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 58: B.Tech. AD - 22HS004 (10 candidates)
		{HallNo: "WW 117", CourseCode: "22HS004", RegisterNos: expandRange("7376262AD510", "7376262AD519"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 118 ---
		// S.No 59: B.E. CS - 22HS004 (13 candidates)
		{HallNo: "WW 118", CourseCode: "22HS004", RegisterNos: append(expandRange("7376261CS511", "7376261CS514"), expandRange("7376261CS516", "7376261CS524")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 60: B.E. EC - 22HS004 (7 candidates)
		{HallNo: "WW 118", CourseCode: "22HS004", RegisterNos: expandRange("7376251EC101", "7376251EC107"), Time: "09:00 AM – 12:00 PM"},
		// S.No 61: B.Tech. IT - 22HS004 (2 candidates)
		{HallNo: "WW 118", CourseCode: "22HS004", RegisterNos: []string{"7376252IT102", "7376252IT103"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 62: B.Tech. AD - 22HS004 (3 candidates)
		{HallNo: "WW 118", CourseCode: "22HS004", RegisterNos: expandRange("7376262AD520", "7376262AD522"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 202 ---
		// S.No 63: B.E. EC - 22HS004 (25 candidates)
		{HallNo: "WW 202", CourseCode: "22HS004", RegisterNos: expandRange("7376251EC108", "7376251EC132"), Time: "09:00 AM – 12:00 PM"},
		// S.No 64: B.Tech. IT - 22HS004 (25 candidates)
		{HallNo: "WW 202", CourseCode: "22HS004", RegisterNos: expandRange("7376252IT104", "7376252IT128"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 203 ---
		// S.No 65: B.E. EC - 22HS004 (10 candidates)
		{HallNo: "WW 203", CourseCode: "22HS004", RegisterNos: expandRange("7376251EC133", "7376251EC142"), Time: "09:00 AM – 12:00 PM"},
		// S.No 66: B.Tech. IT - 22HS004 (15 candidates)
		{HallNo: "WW 203", CourseCode: "22HS004", RegisterNos: expandRange("7376252IT129", "7376252IT143"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 204 ---
		// S.No 67: B.E. EC - 22HS004 (10 candidates)
		{HallNo: "WW 204", CourseCode: "22HS004", RegisterNos: expandRange("7376251EC153", "7376251EC162"), Time: "09:00 AM – 12:00 PM"},
		// S.No 68: B.Tech. IT - 22HS004 (15 candidates)
		{HallNo: "WW 204", CourseCode: "22HS004", RegisterNos: expandRange("7376252IT159", "7376252IT173"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 205 ---
		// S.No 69: B.E. EC - 22HS004 (10 candidates)
		{HallNo: "WW 205", CourseCode: "22HS004", RegisterNos: expandRange("7376251EC173", "7376251EC182"), Time: "09:00 AM – 12:00 PM"},
		// S.No 70: B.Tech. IT - 22HS004 (15 candidates)
		{HallNo: "WW 205", CourseCode: "22HS004", RegisterNos: expandRange("7376252IT189", "7376252IT203"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 206 ---
		// S.No 71: B.E. EC - 22HS004 (10 candidates)
		{HallNo: "WW 206", CourseCode: "22HS004", RegisterNos: expandRange("7376251EC213", "7376251EC222"), Time: "09:00 AM – 12:00 PM"},
		// S.No 72: B.Tech. IT - 22HS004 (15 candidates)
		{HallNo: "WW 206", CourseCode: "22HS004", RegisterNos: expandRange("7376252IT249", "7376252IT263"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 207 ---
		// S.No 73: B.E. EC - 22HS004 (25 candidates)
		{HallNo: "WW 207", CourseCode: "22HS004", RegisterNos: expandRange("7376251EC223", "7376251EC247"), Time: "09:00 AM – 12:00 PM"},
		// S.No 74: B.Tech. IT - 22HS004 (25 candidates)
		{HallNo: "WW 207", CourseCode: "22HS004", RegisterNos: expandRange("7376252IT264", "7376252IT288"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 208 ---
		// S.No 75: B.E. EC - 22HS004 (10 candidates)
		{HallNo: "WW 208", CourseCode: "22HS004", RegisterNos: expandRange("7376251EC258", "7376251EC267"), Time: "09:00 AM – 12:00 PM"},
		// S.No 76: B.Tech. IT - 22HS004 (15 candidates)
		{HallNo: "WW 208", CourseCode: "22HS004", RegisterNos: expandRange("7376252IT304", "7376252IT318"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 209 ---
		// S.No 77: B.E. EC - 22HS004 (10 candidates)
		{HallNo: "WW 209", CourseCode: "22HS004", RegisterNos: expandRange("7376251EC279", "7376251EC288"), Time: "09:00 AM – 12:00 PM"},
		// S.No 78: B.Tech. IT - 22HS004 (15 candidates)
		{HallNo: "WW 209", CourseCode: "22HS004", RegisterNos: append(expandRange("7376252IT334", "7376252IT336"), expandRange("7376252IT338", "7376252IT349")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 210 ---
		// S.No 79: B.E. EC - 22HS004 (10 candidates)
		{HallNo: "WW 210", CourseCode: "22HS004", RegisterNos: expandRange("7376251EC289", "7376251EC298"), Time: "09:00 AM – 12:00 PM"},
		// S.No 80: B.Tech. IT - 22HS004 (15 candidates)
		{HallNo: "WW 210", CourseCode: "22HS004", RegisterNos: expandRange("7376252IT350", "7376252IT364"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 211 ---
		// S.No 81: B.E. EC - 22HS004 (10 candidates)
		{HallNo: "WW 211", CourseCode: "22HS004", RegisterNos: expandRange("7376251EC143", "7376251EC152"), Time: "09:00 AM – 12:00 PM"},
		// S.No 82: B.Tech. IT - 22HS004 (15 candidates)
		{HallNo: "WW 211", CourseCode: "22HS004", RegisterNos: expandRange("7376252IT144", "7376252IT158"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 212 ---
		// S.No 83: B.E. EE - 22HS004 (3 candidates)
		{HallNo: "WW 212", CourseCode: "22HS004", RegisterNos: expandRange("7376261EE516", "7376261EE518"), Time: "09:00 AM – 12:00 PM"},
		// S.No 84: B.E. MZ - 22HS004 (22 candidates)
		{HallNo: "WW 212", CourseCode: "22HS004", RegisterNos: expandRange("7376251MZ101", "7376251MZ122"), Time: "09:00 AM – 12:00 PM"},
		// S.No 85: B.Tech. BT - 22HS004 (25 candidates)
		{HallNo: "WW 212", CourseCode: "22HS004", RegisterNos: expandRange("7376252BT108", "7376252BT132"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 213 ---
		// S.No 86: B.E. EC - 22HS004 (10 candidates)
		{HallNo: "WW 213", CourseCode: "22HS004", RegisterNos: expandRange("7376251EC163", "7376251EC172"), Time: "09:00 AM – 12:00 PM"},
		// S.No 87: B.Tech. IT - 22HS004 (15 candidates)
		{HallNo: "WW 213", CourseCode: "22HS004", RegisterNos: expandRange("7376252IT174", "7376252IT188"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 214 ---
		// S.No 88: B.E. EC - 22HS004 (10 candidates)
		{HallNo: "WW 214", CourseCode: "22HS004", RegisterNos: expandRange("7376251EC183", "7376251EC192"), Time: "09:00 AM – 12:00 PM"},
		// S.No 89: B.Tech. IT - 22HS004 (15 candidates)
		{HallNo: "WW 214", CourseCode: "22HS004", RegisterNos: expandRange("7376252IT204", "7376252IT218"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 215 ---
		// S.No 90: B.E. EC - 22HS004 (10 candidates)
		{HallNo: "WW 215", CourseCode: "22HS004", RegisterNos: expandRange("7376251EC193", "7376251EC202"), Time: "09:00 AM – 12:00 PM"},
		// S.No 91: B.Tech. IT - 22HS004 (15 candidates)
		{HallNo: "WW 215", CourseCode: "22HS004", RegisterNos: expandRange("7376252IT219", "7376252IT233"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 218 ---
		// S.No 92: B.E. EC - 22HS004 (10 candidates)
		{HallNo: "WW 218", CourseCode: "22HS004", RegisterNos: expandRange("7376251EC299", "7376251EC308"), Time: "09:00 AM – 12:00 PM"},
		// S.No 93: B.Tech. IT - 22HS004 (15 candidates)
		{HallNo: "WW 218", CourseCode: "22HS004", RegisterNos: expandRange("7376252IT365", "7376252IT379"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 219 ---
		// S.No 94: B.E. EC - 22HS004 (10 candidates)
		{HallNo: "WW 219", CourseCode: "22HS004", RegisterNos: expandRange("7376251EC309", "7376251EC318"), Time: "09:00 AM – 12:00 PM"},
		// S.No 95: B.Tech. IT - 22HS004 (15 candidates)
		{HallNo: "WW 219", CourseCode: "22HS004", RegisterNos: append(expandRange("7376252IT380", "7376252IT388"), expandRange("7376262IT502", "7376262IT507")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 220 ---
		// S.No 96: B.E. EC - 22HS004 (10 candidates)
		{HallNo: "WW 220", CourseCode: "22HS004", RegisterNos: expandRange("7376251EC319", "7376251EC328"), Time: "09:00 AM – 12:00 PM"},
		// S.No 97: B.Tech. IT - 22HS004 (9 candidates)
		{HallNo: "WW 220", CourseCode: "22HS004", RegisterNos: expandRange("7376262IT508", "7376262IT516"), Time: "09:00 AM – 12:00 PM"},
		// S.No 98: B.Tech. AL - 22HS004 (1 candidate)
		{HallNo: "WW 220", CourseCode: "22HS004", RegisterNos: []string{"7376252AL101"}, Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 221 ---
		// S.No 99: B.E. EC - 22HS004 (10 candidates)
		{HallNo: "WW 221", CourseCode: "22HS004", RegisterNos: expandRange("7376251EC329", "7376251EC338"), Time: "09:00 AM – 12:00 PM"},
		// S.No 100: B.Tech. AL - 22HS004 (10 candidates)
		{HallNo: "WW 221", CourseCode: "22HS004", RegisterNos: expandRange("7376252AL102", "7376252AL111"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 222 ---
		// S.No 101: B.E. EC - 22HS004 (25 candidates)
		{HallNo: "WW 222", CourseCode: "22HS004", RegisterNos: append(expandRange("7376251EC339", "7376251EC352"), expandRange("7376261EC502", "7376261EC512")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 102: B.Tech. AL - 22HS004 (25 candidates)
		{HallNo: "WW 222", CourseCode: "22HS004", RegisterNos: expandRange("7376252AL112", "7376252AL136"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 223 ---
		// S.No 103: B.E. EC - 22HS004 (8 candidates)
		{HallNo: "WW 223", CourseCode: "22HS004", RegisterNos: expandRange("7376261EC513", "7376261EC520"), Time: "09:00 AM – 12:00 PM"},
		// S.No 104: B.E. EE - 22HS004 (17 candidates)
		{HallNo: "WW 223", CourseCode: "22HS004", RegisterNos: append(expandRange("7376251EE102", "7376251EE109"), expandRange("7376251EE111", "7376251EE119")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 105: B.Tech. AL - 22HS004 (25 candidates)
		{HallNo: "WW 223", CourseCode: "22HS004", RegisterNos: expandRange("7376252AL137", "7376252AL161"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 224 ---
		// S.No 106: B.E. EE - 22HS004 (25 candidates)
		{HallNo: "WW 224", CourseCode: "22HS004", RegisterNos: expandRange("7376251EE120", "7376251EE144"), Time: "09:00 AM – 12:00 PM"},
		// S.No 107: B.Tech. AL - 22HS004 (25 candidates)
		{HallNo: "WW 224", CourseCode: "22HS004", RegisterNos: expandRange("7376252AL162", "7376252AL186"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 225 ---
		// S.No 108: B.E. EE - 22HS004 (25 candidates)
		{HallNo: "WW 225", CourseCode: "22HS004", RegisterNos: expandRange("7376251EE145", "7376251EE169"), Time: "09:00 AM – 12:00 PM"},
		// S.No 109: B.Tech. AL - 22HS004 (25 candidates)
		{HallNo: "WW 225", CourseCode: "22HS004", RegisterNos: expandRange("7376252AL187", "7376252AL211"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 226 ---
		// S.No 110: B.E. EE - 22HS004 (25 candidates)
		{HallNo: "WW 226", CourseCode: "22HS004", RegisterNos: expandRange("7376251EE170", "7376251EE194"), Time: "09:00 AM – 12:00 PM"},
		// S.No 111: B.Tech. AL - 22HS004 (25 candidates)
		{HallNo: "WW 226", CourseCode: "22HS004", RegisterNos: expandRange("7376252AL212", "7376252AL236"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 227 ---
		// S.No 112: B.E. EE - 22HS004 (25 candidates)
		{HallNo: "WW 227", CourseCode: "22HS004", RegisterNos: append(expandRange("7376251EE195", "7376251EE205"), expandRange("7376261EE502", "7376261EE515")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 113: B.Tech. BT - 22HS004 (6 candidates)
		{HallNo: "WW 227", CourseCode: "22HS004", RegisterNos: expandRange("7376252BT102", "7376252BT107"), Time: "09:00 AM – 12:00 PM"},
		// S.No 114: B.Tech. AL - 22HS004 (19 candidates)
		{HallNo: "WW 227", CourseCode: "22HS004", RegisterNos: append(expandRange("7376252AL237", "7376252AL246"), expandRange("7376262AL501", "7376262AL509")...), Time: "09:00 AM – 12:00 PM"},
	}
}

// ============================================================================
// 18-11-2026 FORENOON SESSION (09:00 AM – 12:00 PM) - Total: 838 Students
// ============================================================================
func buildSeatingData18Nov2026FN() []studentmodels.SeatingRecord {
	return []studentmodels.SeatingRecord{
		// --- Hall: WW 008 ---
		// S.No 1: B.E. CS - 22CS004* (15 candidates)
		{HallNo: "WW 008", CourseCode: "22CS004*", RegisterNos: append(append(append(append([]string{"7376231CS218", "7376231CS225", "7376231CS227"}, expandRange("7376231CS229", "7376231CS231")...), []string{"7376231CS234", "7376231CS235", "7376231CS237", "7376231CS238", "7376231CS240"}...), expandRange("7376231CS251", "7376231CS253")...), []string{"7376231CS272"}...), Time: "09:00 AM – 12:00 PM"},
		// S.No 2: B.E. EC - 22EC023 (10 candidates)
		{HallNo: "WW 008", CourseCode: "22EC023", RegisterNos: []string{"7376231EC182", "7376231EC185", "7376231EC187", "7376231EC190", "7376231EC196", "7376231EC201", "7376231EC211", "7376231EC231", "7376231EC234", "7376231EC243"}, Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 011 ---
		// S.No 3: UG - 22EC023 (1 candidate)
		{HallNo: "WW 011", CourseCode: "22EC023", RegisterNos: []string{"7376241EC520"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 4: B.E. SE - 22IS002 (15 candidates)
		{HallNo: "WW 011", CourseCode: "22IS002", RegisterNos: append(expandRange("7376231SE122", "7376231SE128"), expandRange("7376231SE130", "7376231SE137")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 5: B.E. CD - 22CD026 (9 candidates)
		{HallNo: "WW 011", CourseCode: "22CD026", RegisterNos: expandRange("7376231CD103", "7376231CD111"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 012 ---
		// S.No 6: B.E. ME - 22ME057 (13 candidates)
		{HallNo: "WW 012", CourseCode: "22ME057", RegisterNos: append(expandRange("7376231ME101", "7376231ME106"), []string{"7376231ME108", "7376231ME110", "7376231ME111", "7376231ME113", "7376231ME116", "7376231ME118", "7376231ME119"}...), Time: "09:00 AM – 12:00 PM"},
		// S.No 7: B.E. SE - 22IS002 (2 candidates)
		{HallNo: "WW 012", CourseCode: "22IS002", RegisterNos: []string{"7376231SE155", "7376241SE501"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 8: B.E. CD - 22CD026 (10 candidates)
		{HallNo: "WW 012", CourseCode: "22CD026", RegisterNos: append(append(append([]string{"7376231CD125"}, expandRange("7376231CD128", "7376231CD130")...), expandRange("7376231CD134", "7376231CD137")...), []string{"7376231CD139", "7376231CD140"}...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 113 ---
		// S.No 9: B.Tech. IT - 22IT040 (15 candidates)
		{HallNo: "WW 113", CourseCode: "22IT040", RegisterNos: append(append(append(append([]string{"7376232IT101", "7376232IT102"}, expandRange("7376232IT104", "7376232IT109")...), expandRange("7376232IT111", "7376232IT113")...), []string{"7376232IT115"}...), expandRange("7376232IT118", "7376232IT120")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 10: B.Tech. AD - 22AI024 (10 candidates)
		{HallNo: "WW 113", CourseCode: "22AI024", RegisterNos: append(append(expandRange("7376232AD102", "7376232AD106"), expandRange("7376232AD108", "7376232AD110")...), []string{"7376232AD112", "7376232AD113"}...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 114 ---
		// S.No 11: B.Tech. IT - 22IT040 (15 candidates)
		{HallNo: "WW 114", CourseCode: "22IT040", RegisterNos: expandRange("7376232IT122", "7376232IT136"), Time: "09:00 AM – 12:00 PM"},
		// S.No 12: B.Tech. AD - 22AI024 (10 candidates)
		{HallNo: "WW 114", CourseCode: "22AI024", RegisterNos: append(append([]string{"7376232AD114"}, expandRange("7376232AD116", "7376232AD122")...), []string{"7376232AD125", "7376232AD126"}...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 115 ---
		// S.No 13: B.Tech. IT - 22IT040 (15 candidates)
		{HallNo: "WW 115", CourseCode: "22IT040", RegisterNos: append(append(expandRange("7376232IT137", "7376232IT139"), []string{"7376232IT142"}...), expandRange("7376232IT144", "7376232IT154")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 14: B.Tech. AD - 22AI024 (10 candidates)
		{HallNo: "WW 115", CourseCode: "22AI024", RegisterNos: append([]string{"7376232AD129"}, expandRange("7376232AD131", "7376232AD139")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 117 ---
		// S.No 15: B.Tech. IT - 22IT040 (15 candidates)
		{HallNo: "WW 117", CourseCode: "22IT040", RegisterNos: expandRange("7376232IT155", "7376232IT169"), Time: "09:00 AM – 12:00 PM"},
		// S.No 16: B.Tech. AD - 22AI024 (10 candidates)
		{HallNo: "WW 117", CourseCode: "22AI024", RegisterNos: expandRange("7376232AD141", "7376232AD150"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 118 ---
		// S.No 17: B.Tech. IT - 22IT040 (15 candidates)
		{HallNo: "WW 118", CourseCode: "22IT040", RegisterNos: append(expandRange("7376232IT170", "7376232IT177"), expandRange("7376232IT179", "7376232IT185")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 18: B.Tech. AD - 22AI024 (10 candidates)
		{HallNo: "WW 118", CourseCode: "22AI024", RegisterNos: append(append(expandRange("7376232AD151", "7376232AD153"), []string{"7376232AD156", "7376232AD157", "7376232AD159", "7376232AD160"}...), expandRange("7376232AD163", "7376232AD165")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 202 ---
		// S.No 19: B.Tech. IT - 22IT040 (25 candidates)
		{HallNo: "WW 202", CourseCode: "22IT040", RegisterNos: append(append(append(expandRange("7376232IT187", "7376232IT191"), expandRange("7376232IT193", "7376232IT201")...), expandRange("7376232IT203", "7376232IT209")...), expandRange("7376232IT211", "7376232IT214")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 20: B.Tech. AD - 22AI024 (25 candidates)
		{HallNo: "WW 202", CourseCode: "22AI024", RegisterNos: append(append(append(append([]string{"7376232AD168", "7376232AD170", "7376232AD171", "7376232AD174", "7376232AD175", "7376232AD177", "7376232AD179", "7376232AD181"}, expandRange("7376232AD184", "7376232AD188")...), []string{"7376232AD191", "7376232AD196", "7376232AD197"}...), expandRange("7376232AD199", "7376232AD205")...), []string{"7376232AD207", "7376232AD208"}...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 203 ---
		// S.No 21: B.Tech. IT - 22IT040 (15 candidates)
		{HallNo: "WW 203", CourseCode: "22IT040", RegisterNos: append(append(append([]string{"7376232IT215", "7376232IT216"}, expandRange("7376232IT218", "7376232IT220")...), []string{"7376232IT222", "7376232IT224", "7376232IT226"}...), expandRange("7376232IT228", "7376232IT234")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 22: B.Tech. AD - 22AI024 (10 candidates)
		{HallNo: "WW 203", CourseCode: "22AI024", RegisterNos: append(append(append(expandRange("7376232AD209", "7376232AD211"), []string{"7376232AD215"}...), expandRange("7376232AD217", "7376232AD219")...), []string{"7376232AD221", "7376232AD222", "7376232AD225"}...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 204 ---
		// S.No 23: B.Tech. IT - 22IT040 (15 candidates)
		{HallNo: "WW 204", CourseCode: "22IT040", RegisterNos: append(append(expandRange("7376232IT254", "7376232IT259"), []string{"7376232IT261", "7376232IT262", "7376232IT264"}...), expandRange("7376232IT266", "7376232IT271")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 24: B.Tech. AD - 22AI024 (10 candidates)
		{HallNo: "WW 204", CourseCode: "22AI024", RegisterNos: []string{"7376232AD238", "7376232AD242", "7376232AD246", "7376232AD248", "7376232AD249", "7376232AD251", "7376232AD255", "7376232AD257", "7376232AD258", "7376232AD260"}, Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 205 ---
		// S.No 25: B.E. CS - 22CS004* (7 candidates)
		{HallNo: "WW 205", CourseCode: "22CS004*", RegisterNos: []string{"7376231CS102", "7376231CS104", "7376231CS106", "7376231CS107", "7376231CS115", "7376231CS117", "7376231CS118"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 26: B.Tech. IT - 22IT040 (8 candidates)
		{HallNo: "WW 205", CourseCode: "22IT040", RegisterNos: append(expandRange("7376242IT503", "7376242IT505"), expandRange("7376242IT507", "7376242IT511")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 27: B.Tech. AD - 22AI024 (10 candidates)
		{HallNo: "WW 205", CourseCode: "22AI024", RegisterNos: append([]string{"7376232AD277", "7376232AD279", "7376232AD281", "7376232AD283", "7376232AD284", "7376232AD286"}, expandRange("7376242AD501", "7376242AD504")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 206 ---
		// S.No 28: B.E. CS - 22CS004* (15 candidates)
		{HallNo: "WW 206", CourseCode: "22CS004*", RegisterNos: []string{"7376231CS274", "7376231CS278", "7376231CS284", "7376231CS287", "7376231CS290", "7376231CS299", "7376231CS308", "7376231CS312", "7376231CS313", "7376231CS323", "7376231CS324", "7376231CS331", "7376231CS332", "7376231CS335", "7376231CS341"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 29: B.E. EC - 22EC023 (10 candidates)
		{HallNo: "WW 206", CourseCode: "22EC023", RegisterNos: append(append([]string{"7376231EC248", "7376231EC250", "7376231EC254", "7376231EC262"}, expandRange("7376231EC267", "7376231EC269")...), []string{"7376231EC279", "7376231EC283", "7376231EC291"}...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 207 ---
		// S.No 30: B.E. CS - 22CS004* (9 candidates)
		{HallNo: "WW 207", CourseCode: "22CS004*", RegisterNos: []string{"7376231CS342", "7376231CS344", "7376231CS346", "7376231CS349", "7376231CS350", "7376231CS352", "7376231CS354", "7376241CS507", "7376241CS519"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 31: B.E. EC - 22EC023 (25 candidates)
		{HallNo: "WW 207", CourseCode: "22EC023", RegisterNos: append(append(append(append(append(append(append([]string{"7376231EC295", "7376231EC297", "7376231EC298"}, expandRange("7376231EC305", "7376231EC308")...), []string{"7376231EC310", "7376231EC316", "7376231EC320"}...), expandRange("7376231EC324", "7376231EC327")...), []string{"7376231EC333", "7376231EC334"}...), expandRange("7376241EC503", "7376241EC506")...), expandRange("7376241EC508", "7376241EC510")...), []string{"7376241EC512", "7376241EC513"}...), Time: "09:00 AM – 12:00 PM"},
		// S.No 32: B.E. SE - 22IS002 (16 candidates)
		{HallNo: "WW 207", CourseCode: "22IS002", RegisterNos: append(append([]string{"7376231SE102", "7376231SE103", "7376231SE105"}, expandRange("7376231SE107", "7376231SE113")...), expandRange("7376231SE116", "7376231SE121")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 208 ---
		// S.No 33: UG - 22IS002 (15 candidates)
		{HallNo: "WW 208", CourseCode: "22IS002", RegisterNos: append(append(expandRange("7376231SE138", "7376231SE143"), []string{"7376231SE145", "7376231SE146"}...), expandRange("7376231SE148", "7376231SE154")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 34: B.E. CD - 22CD026 (10 candidates)
		{HallNo: "WW 208", CourseCode: "22CD026", RegisterNos: append(append(expandRange("7376231CD112", "7376231CD117"), []string{"7376231CD119"}...), expandRange("7376231CD121", "7376231CD123")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 209 ---
		// S.No 35: B.E. ME - 22ME057 (15 candidates)
		{HallNo: "WW 209", CourseCode: "22ME057", RegisterNos: append(append(append(append([]string{"7376231ME121", "7376231ME123"}, expandRange("7376231ME126", "7376231ME128")...), []string{"7376231ME130", "7376231ME132"}...), expandRange("7376231ME134", "7376231ME138")...), expandRange("7376231ME140", "7376231ME142")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 36: B.E. CD - 22CD026 (10 candidates)
		{HallNo: "WW 209", CourseCode: "22CD026", RegisterNos: append(expandRange("7376231CD142", "7376231CD147"), []string{"7376231CD149", "7376231CD151", "7376231CD154", "7376231CD156"}...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 210 ---
		// S.No 37: B.E. EC - 22EC041 (1 candidate)
		{HallNo: "WW 210", CourseCode: "22EC041", RegisterNos: []string{"7376231EC104"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 38: B.E. EE - 22EE030 (5 candidates)
		{HallNo: "WW 210", CourseCode: "22EE030", RegisterNos: append(expandRange("7376231EE102", "7376231EE104"), []string{"7376231EE106", "7376231EE107"}...), Time: "09:00 AM – 12:00 PM"},
		// S.No 39: B.E. ME - 22ME057 (14 candidates)
		{HallNo: "WW 210", CourseCode: "22ME057", RegisterNos: append(append(append(append([]string{"7376231ME144"}, expandRange("7376231ME147", "7376231ME149")...), []string{"7376231ME151"}...), expandRange("7376231ME153", "7376231ME158")...), []string{"7376231ME160", "7376231ME161", "7376241ME505"}...), Time: "09:00 AM – 12:00 PM"},
		// S.No 40: B.E. CD - 22CD026 (5 candidates)
		{HallNo: "WW 210", CourseCode: "22CD026", RegisterNos: []string{"7376231CD157", "7376231CD158", "7376231CD160", "7376231CD161", "7376241CD501"}, Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 211 ---
		// S.No 41: B.Tech. IT - 22IT040 (15 candidates)
		{HallNo: "WW 211", CourseCode: "22IT040", RegisterNos: append(append(expandRange("7376232IT235", "7376232IT237"), []string{"7376232IT240"}...), expandRange("7376232IT243", "7376232IT253")...), Time: "09:00 AM – 12:00 PM"},
		// S.No 42: B.Tech. AD - 22AI024 (10 candidates)
		{HallNo: "WW 211", CourseCode: "22AI024", RegisterNos: append([]string{"7376232AD226", "7376232AD227"}, expandRange("7376232AD229", "7376232AD236")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 212 ---
		// S.No 43: B.E. CE - 22CE012 (2 candidates)
		{HallNo: "WW 212", CourseCode: "22CE012", RegisterNos: []string{"7376231CE102", "7376231CE124"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 44: B.E. BM - 22BM045 (3 candidates)
		{HallNo: "WW 212", CourseCode: "22BM045", RegisterNos: []string{"7376231BM137", "7376231BM146", "7376231BM148"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 45: B.Tech. BT - 22BT011 (2 candidates)
		{HallNo: "WW 212", CourseCode: "22BT011", RegisterNos: []string{"7376232BT134", "7376232BT215"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 46: UG - 22BT043 (1 candidate)
		{HallNo: "WW 212", CourseCode: "22BT043", RegisterNos: []string{"7376232BT202"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 47: B.Tech. FD - 22FD038 (5 candidates)
		{HallNo: "WW 212", CourseCode: "22FD038", RegisterNos: []string{"7376232FD107", "7376232FD132", "7376232FD133", "7376232FD137", "7376232FD142"}, Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 213 ---
		// S.No 48: B.Tech. IT - 22IT040 (15 candidates)
		{HallNo: "WW 213", CourseCode: "22IT040", RegisterNos: append(append(append(expandRange("7376232IT272", "7376232IT276"), expandRange("7376232IT278", "7376232IT281")...), expandRange("7376232IT283", "7376232IT286")...), []string{"7376242IT501", "7376242IT502"}...), Time: "09:00 AM – 12:00 PM"},
		// S.No 49: B.Tech. AD - 22AI024 (10 candidates)
		{HallNo: "WW 213", CourseCode: "22AI024", RegisterNos: append(append(expandRange("7376232AD263", "7376232AD267"), []string{"7376232AD269"}...), expandRange("7376232AD272", "7376232AD275")...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 214 ---
		// S.No 50: B.E. CS - 22CS004* (15 candidates)
		{HallNo: "WW 214", CourseCode: "22CS004*", RegisterNos: append(expandRange("7376231CS120", "7376231CS122"), []string{"7376231CS124", "7376231CS125", "7376231CS127", "7376231CS129", "7376231CS136", "7376231CS142", "7376231CS146", "7376231CS147", "7376231CS151", "7376231CS156", "7376231CS157", "7376231CS159"}...), Time: "09:00 AM – 12:00 PM"},
		// S.No 51: B.E. EC - 22EC023 (4 candidates)
		{HallNo: "WW 214", CourseCode: "22EC023", RegisterNos: []string{"7376231EC101", "7376231EC102", "7376231EC107", "7376231EC108"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 52: B.Tech. AD - 22AI024 (6 candidates)
		{HallNo: "WW 214", CourseCode: "22AI024", RegisterNos: expandRange("7376242AD505", "7376242AD510"), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 215 ---
		// S.No 53: B.E. CS - 22CS004* (15 candidates)
		{HallNo: "WW 215", CourseCode: "22CS004*", RegisterNos: []string{"7376231CS162", "7376231CS165", "7376231CS169", "7376231CS171", "7376231CS174", "7376231CS176", "7376231CS177", "7376231CS180", "7376231CS181", "7376231CS183", "7376231CS185", "7376231CS193", "7376231CS195", "7376231CS212", "7376231CS214"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 54: B.E. EC - 22EC023 (10 candidates)
		{HallNo: "WW 215", CourseCode: "22EC023", RegisterNos: []string{"7376231EC112", "7376231EC116", "7376231EC119", "7376231EC132", "7376231EC138", "7376231EC150", "7376231EC153", "7376231EC157", "7376231EC159", "7376231EC180"}, Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 218 ---
		// S.No 55: UG - 22EC041 (15 candidates)
		{HallNo: "WW 218", CourseCode: "22EC041", RegisterNos: []string{"7376231EC105", "7376231EC120", "7376231EC121", "7376231EC133", "7376231EC143", "7376231EC155", "7376231EC172", "7376231EC175", "7376231EC178", "7376231EC179", "7376231EC203", "7376231EC207", "7376231EC216", "7376231EC244", "7376231EC275"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 56: B.E. EE - 22EE030 (10 candidates)
		{HallNo: "WW 218", CourseCode: "22EE030", RegisterNos: append(append([]string{"7376231EE111", "7376231EE112", "7376231EE114", "7376231EE115"}, expandRange("7376231EE117", "7376231EE120")...), []string{"7376231EE123", "7376231EE124"}...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 219 ---
		// S.No 57: B.E. EC - 22EC041 (15 candidates)
		{HallNo: "WW 219", CourseCode: "22EC041", RegisterNos: []string{"7376231EC278", "7376231EC282", "7376231EC285", "7376231EC294", "7376231EC296", "7376231EC300", "7376231EC303", "7376231EC309", "7376231EC311", "7376231EC314", "7376231EC315", "7376231EC317", "7376231EC330", "7376231EC331", "7376241EC511"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 58: B.E. EE - 22EE030 (10 candidates)
		{HallNo: "WW 219", CourseCode: "22EE030", RegisterNos: append(append([]string{"7376231EE128", "7376231EE130", "7376231EE133", "7376231EE136", "7376231EE141"}, expandRange("7376231EE143", "7376231EE145")...), []string{"7376231EE147", "7376231EE149"}...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 222 ---
		// S.No 59: B.E. EC - 22EC041 (1 candidate)
		{HallNo: "WW 222", CourseCode: "22EC041", RegisterNos: []string{"7376241EC516"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 60: B.E. EE - 22EE030 (10 candidates)
		{HallNo: "WW 222", CourseCode: "22EE030", RegisterNos: append(append([]string{"7376231EE151", "7376231EE154", "7376231EE156", "7376231EE157", "7376231EE159", "7376231EE161"}, expandRange("7376241EE501", "7376241EE503")...), []string{"7376241EE506"}...), Time: "09:00 AM – 12:00 PM"},
		// S.No 61: B.E. MZ - 22MC028 (24 candidates)
		{HallNo: "WW 222", CourseCode: "22MC028", RegisterNos: append(append(append([]string{"7376231MZ101", "7376231MZ102"}, expandRange("7376231MZ104", "7376231MZ107")...), expandRange("7376231MZ110", "7376231MZ113")...), []string{"7376231MZ115", "7376231MZ119", "7376231MZ121", "7376231MZ122", "7376231MZ126", "7376231MZ128", "7376231MZ132", "7376231MZ133", "7376231MZ137", "7376231MZ138", "7376231MZ145", "7376231MZ146", "7376231MZ148", "7376231MZ151"}...), Time: "09:00 AM – 12:00 PM"},
		// S.No 62: B.Tech. CB - 22CB035 (15 candidates)
		{HallNo: "WW 222", CourseCode: "22CB035", RegisterNos: append(append([]string{"7376232CB102", "7376232CB103"}, expandRange("7376232CB105", "7376232CB108")...), []string{"7376232CB110", "7376232CB111", "7376232CB114", "7376232CB117", "7376232CB120", "7376232CB123", "7376232CB125", "7376232CB128", "7376232CB130"}...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 223 ---
		// S.No 63: B.E. EI - 22EI049 (19 candidates)
		{HallNo: "WW 223", CourseCode: "22EI049", RegisterNos: append(append(append(expandRange("7376231EI102", "7376231EI104"), []string{"7376231EI106", "7376231EI108", "7376231EI112", "7376231EI115", "7376231EI116"}...), expandRange("7376231EI119", "7376231EI121")...), []string{"7376231EI124", "7376231EI125", "7376231EI130", "7376231EI133", "7376231EI135", "7376231EI138", "7376231EI139", "7376231EI143"}...), Time: "09:00 AM – 12:00 PM"},
		// S.No 64: B.E. MZ - 22MC028 (6 candidates)
		{HallNo: "WW 223", CourseCode: "22MC028", RegisterNos: append(expandRange("7376231MZ152", "7376231MZ154"), []string{"7376231MZ157", "7376241MZ501", "7376241MZ502"}...), Time: "09:00 AM – 12:00 PM"},
		// S.No 65: B.Tech. CB - 22CB035 (14 candidates)
		{HallNo: "WW 223", CourseCode: "22CB035", RegisterNos: append(expandRange("7376232CB131", "7376232CB135"), []string{"7376232CB141", "7376232CB144", "7376232CB145", "7376232CB157", "7376232CB160", "7376232CB162", "7376232CB163", "7376242CB502", "7376242CB503"}...), Time: "09:00 AM – 12:00 PM"},
		// S.No 66: B.Tech. AG - 22AG044 (11 candidates)
		{HallNo: "WW 223", CourseCode: "22AG044", RegisterNos: append(expandRange("7376232AG102", "7376232AG108"), []string{"7376232AG111", "7376232AG114", "7376232AG116", "7376232AG117"}...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 224 ---
		// S.No 67: B.E. CS - 22CS026 (15 candidates)
		{HallNo: "WW 224", CourseCode: "22CS026", RegisterNos: []string{"7376231CS103", "7376231CS119", "7376231CS131", "7376231CS173", "7376231CS189", "7376231CS190", "7376231CS196", "7376231CS210", "7376231CS244", "7376231CS257", "7376231CS259", "7376231CS266", "7376231CS292", "7376231CS295", "7376231CS321"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 68: B.E. EI - 22EI049 (10 candidates)
		{HallNo: "WW 224", CourseCode: "22EI049", RegisterNos: []string{"7376231EI144", "7376231EI146", "7376231EI147", "7376231EI151", "7376231EI156", "7376231EI158", "7376231EI159", "7376241EI501", "7376241EI503", "7376241EI504"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 69: B.Tech. FT - 22FT019 (8 candidates)
		{HallNo: "WW 224", CourseCode: "22FT019", RegisterNos: append(expandRange("7376232FT101", "7376232FT106"), []string{"7376232FT108", "7376232FT109"}...), Time: "09:00 AM – 12:00 PM"},
		// S.No 70: B.Tech. AG - 22AG044 (17 candidates)
		{HallNo: "WW 224", CourseCode: "22AG044", RegisterNos: append(append(append(append([]string{"7376232AG118", "7376232AG119", "7376232AG121", "7376232AG128", "7376232AG129"}, expandRange("7376232AG137", "7376232AG139")...), []string{"7376232AG144", "7376232AG145", "7376232AG147"}...), expandRange("7376232AG151", "7376232AG153")...), []string{"7376242AG501", "7376242AG502", "7376242AG504"}...), Time: "09:00 AM – 12:00 PM"},
		// --- Hall: WW 225 ---
		// S.No 71: B.E. CS - 22CS026 (5 candidates)
		{HallNo: "WW 225", CourseCode: "22CS026", RegisterNos: []string{"7376241CS502", "7376241CS504", "7376241CS513", "7376241CS515", "7376241CS516"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 72: B.E. BM - 22BM045 (5 candidates)
		{HallNo: "WW 225", CourseCode: "22BM045", RegisterNos: []string{"7376231BM104", "7376231BM107", "7376231BM109", "7376231BM127", "7376231BM133"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 73: B.Tech. BT - 22BT043 (13 candidates)
		{HallNo: "WW 225", CourseCode: "22BT043", RegisterNos: []string{"7376232BT107", "7376232BT132", "7376232BT136", "7376232BT139", "7376232BT142", "7376232BT156", "7376232BT159", "7376232BT169", "7376232BT171", "7376232BT177", "7376232BT182", "7376232BT191", "7376232BT200"}, Time: "09:00 AM – 12:00 PM"},
		// S.No 74: B.Tech. FT - 22FT019 (12 candidates)
		{HallNo: "WW 225", CourseCode: "22FT019", RegisterNos: append(expandRange("7376232FT110", "7376232FT120"), []string{"7376242FT501"}...), Time: "09:00 AM – 12:00 PM"},
		// S.No 75: B.Tech. CT - 22CT034 (15 candidates)
		{HallNo: "WW 225", CourseCode: "22CT034", RegisterNos: []string{"7376232CT102", "7376232CT107", "7376232CT111", "7376232CT113", "7376232CT117", "7376232CT121", "7376232CT126", "7376232CT132", "7376232CT134", "7376232CT140", "7376232CT142", "7376232CT144", "7376232CT145", "7376232CT147", "7376232CT159"}, Time: "09:00 AM – 12:00 PM"},
	}
}

// ============================================================================
// 18-11-2026 AFTERNOON SESSION (01:30 PM – 04:30 PM) - Total: 1834 Students
// ============================================================================
func buildSeatingData18Nov2026AN() []studentmodels.SeatingRecord {
	return []studentmodels.SeatingRecord{
		// --- Hall: ME 102 ---
		// S.No 1: B.E. CS - 22CS502 (25 candidates)
		{HallNo: "ME 102", CourseCode: "22CS502", RegisterNos: expandRange("7376241CS102", "7376241CS126"), Time: "01:30 PM – 04:30 PM"},
		// S.No 2: B.E. EC - 22EC502 (20 candidates)
		{HallNo: "ME 102", CourseCode: "22EC502", RegisterNos: append(append(expandRange("7376241EC103", "7376241EC110"), []string{"7376241EC112", "7376241EC113"}...), expandRange("7376241EC115", "7376241EC124")...), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: ME 107 ---
		// S.No 3: B.E. CS - 22CS502 (25 candidates)
		{HallNo: "ME 107", CourseCode: "22CS502", RegisterNos: expandRange("7376241CS127", "7376241CS151"), Time: "01:30 PM – 04:30 PM"},
		// S.No 4: B.E. EC - 22EC502 (20 candidates)
		{HallNo: "ME 107", CourseCode: "22EC502", RegisterNos: expandRange("7376241EC125", "7376241EC144"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: ME 201 ---
		// S.No 5: B.E. CS - 22CS502 (25 candidates)
		{HallNo: "ME 201", CourseCode: "22CS502", RegisterNos: append(expandRange("7376241CS152", "7376241CS157"), expandRange("7376241CS159", "7376241CS177")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 6: B.E. EC - 22EC502 (20 candidates)
		{HallNo: "ME 201", CourseCode: "22EC502", RegisterNos: expandRange("7376241EC145", "7376241EC164"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: ME 202 ---
		// S.No 7: B.E. CS - 22CS502 (25 candidates)
		{HallNo: "ME 202", CourseCode: "22CS502", RegisterNos: append(expandRange("7376241CS178", "7376241CS188"), expandRange("7376241CS190", "7376241CS203")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 8: B.E. EC - 22EC502 (20 candidates)
		{HallNo: "ME 202", CourseCode: "22EC502", RegisterNos: append(expandRange("7376241EC165", "7376241EC174"), expandRange("7376241EC176", "7376241EC185")...), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: ME 203 ---
		// S.No 9: B.E. CS - 22CS502 (25 candidates)
		{HallNo: "ME 203", CourseCode: "22CS502", RegisterNos: expandRange("7376241CS204", "7376241CS228"), Time: "01:30 PM – 04:30 PM"},
		// S.No 10: B.E. EC - 22EC502 (20 candidates)
		{HallNo: "ME 203", CourseCode: "22EC502", RegisterNos: expandRange("7376241EC186", "7376241EC205"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: ME 204 ---
		// S.No 11: B.E. CS - 22CS502 (25 candidates)
		{HallNo: "ME 204", CourseCode: "22CS502", RegisterNos: expandRange("7376241CS230", "7376241CS254"), Time: "01:30 PM – 04:30 PM"},
		// S.No 12: B.E. EC - 22EC502 (20 candidates)
		{HallNo: "ME 204", CourseCode: "22EC502", RegisterNos: append([]string{"7376241EC206", "7376241EC207"}, expandRange("7376241EC209", "7376241EC226")...), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: ME 205 ---
		// S.No 13: B.E. CS - 22CS502 (25 candidates)
		{HallNo: "ME 205", CourseCode: "22CS502", RegisterNos: expandRange("7376241CS255", "7376241CS279"), Time: "01:30 PM – 04:30 PM"},
		// S.No 14: B.E. EC - 22EC502 (20 candidates)
		{HallNo: "ME 205", CourseCode: "22EC502", RegisterNos: append(expandRange("7376241EC227", "7376241EC230"), expandRange("7376241EC232", "7376241EC247")...), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: ME 206 ---
		// S.No 15: B.E. CS - 22CS502 (25 candidates)
		{HallNo: "ME 206", CourseCode: "22CS502", RegisterNos: expandRange("7376241CS280", "7376241CS304"), Time: "01:30 PM – 04:30 PM"},
		// S.No 16: B.E. EC - 22EC502 (20 candidates)
		{HallNo: "ME 206", CourseCode: "22EC502", RegisterNos: expandRange("7376241EC248", "7376241EC267"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: ME 301 ---
		// S.No 17: B.E. CS - 22CS502 (25 candidates)
		{HallNo: "ME 301", CourseCode: "22CS502", RegisterNos: expandRange("7376241CS305", "7376241CS329"), Time: "01:30 PM – 04:30 PM"},
		// S.No 18: B.E. EC - 22EC502 (20 candidates)
		{HallNo: "ME 301", CourseCode: "22EC502", RegisterNos: expandRange("7376241EC268", "7376241EC287"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: ME 302 ---
		// S.No 19: B.E. CS - 22CS502 (25 candidates)
		{HallNo: "ME 302", CourseCode: "22CS502", RegisterNos: append(expandRange("7376241CS330", "7376241CS353"), []string{"7376241CS355"}...), Time: "01:30 PM – 04:30 PM"},
		// S.No 20: B.E. EC - 22EC502 (20 candidates)
		{HallNo: "ME 302", CourseCode: "22EC502", RegisterNos: expandRange("7376241EC288", "7376241EC307"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: ME 303 ---
		// S.No 21: B.E. CS - 22CS502 (25 candidates)
		{HallNo: "ME 303", CourseCode: "22CS502", RegisterNos: expandRange("7376241CS356", "7376241CS380"), Time: "01:30 PM – 04:30 PM"},
		// S.No 22: B.E. EC - 22EC502 (20 candidates)
		{HallNo: "ME 303", CourseCode: "22EC502", RegisterNos: expandRange("7376241EC308", "7376241EC327"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: ME 304 ---
		// S.No 23: B.E. CS - 22CS502 (25 candidates)
		{HallNo: "ME 304", CourseCode: "22CS502", RegisterNos: expandRange("7376241CS381", "7376241CS405"), Time: "01:30 PM – 04:30 PM"},
		// S.No 24: B.E. EC - 22EC502 (20 candidates)
		{HallNo: "ME 304", CourseCode: "22EC502", RegisterNos: expandRange("7376241EC328", "7376241EC347"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: ME 305 ---
		// S.No 25: B.E. CS - 22CS502 (25 candidates)
		{HallNo: "ME 305", CourseCode: "22CS502", RegisterNos: expandRange("7376241CS406", "7376241CS430"), Time: "01:30 PM – 04:30 PM"},
		// S.No 26: B.E. EC - 22EC502 (20 candidates)
		{HallNo: "ME 305", CourseCode: "22EC502", RegisterNos: append(expandRange("7376241EC348", "7376241EC352"), expandRange("7376251EC501", "7376251EC515")...), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: SF 001 ---
		// S.No 27: B.E. CS - 22CS502 (20 candidates)
		{HallNo: "SF 001", CourseCode: "22CS502", RegisterNos: append(expandRange("7376241CS431", "7376241CS442"), expandRange("7376241CS444", "7376241CS451")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 28: B.E. EC - 22EC502 (6 candidates)
		{HallNo: "SF 001", CourseCode: "22EC502", RegisterNos: expandRange("7376251EC516", "7376251EC521"), Time: "01:30 PM – 04:30 PM"},
		// S.No 29: B.Tech. IT - 22IT502 (14 candidates)
		{HallNo: "SF 001", CourseCode: "22IT502", RegisterNos: expandRange("7376242IT101", "7376242IT114"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: SF 002 ---
		// S.No 30: B.E. CS - 22CS502 (20 candidates)
		{HallNo: "SF 002", CourseCode: "22CS502", RegisterNos: append(expandRange("7376241CS452", "7376241CS469"), []string{"7376241CS471", "7376241CS472"}...), Time: "01:30 PM – 04:30 PM"},
		// S.No 31: B.Tech. IT - 22IT502 (20 candidates)
		{HallNo: "SF 002", CourseCode: "22IT502", RegisterNos: expandRange("7376242IT115", "7376242IT134"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: SF 101 ---
		// S.No 32: B.E. CS - 22CS502 (20 candidates)
		{HallNo: "SF 101", CourseCode: "22CS502", RegisterNos: append(append(expandRange("7376241CS473", "7376241CS476"), expandRange("7376251CS501", "7376251CS513")...), expandRange("7376251CS515", "7376251CS517")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 33: B.Tech. IT - 22IT502 (20 candidates)
		{HallNo: "SF 101", CourseCode: "22IT502", RegisterNos: append(expandRange("7376242IT135", "7376242IT153"), []string{"7376242IT155"}...), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: SF 102 ---
		// S.No 34: B.E. CS - 22CS502 (7 candidates)
		{HallNo: "SF 102", CourseCode: "22CS502", RegisterNos: expandRange("7376251CS518", "7376251CS524"), Time: "01:30 PM – 04:30 PM"},
		// S.No 35: B.Tech. IT - 22IT502 (20 candidates)
		{HallNo: "SF 102", CourseCode: "22IT502", RegisterNos: expandRange("7376242IT156", "7376242IT175"), Time: "01:30 PM – 04:30 PM"},
		// S.No 36: B.Tech. AD - 22AI502 (13 candidates)
		{HallNo: "SF 102", CourseCode: "22AI502", RegisterNos: expandRange("7376242AD102", "7376242AD114"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: SF 103 ---
		// S.No 37: B.Tech. IT - 22IT502 (20 candidates)
		{HallNo: "SF 103", CourseCode: "22IT502", RegisterNos: expandRange("7376242IT176", "7376242IT195"), Time: "01:30 PM – 04:30 PM"},
		// S.No 38: B.Tech. AD - 22AI502 (20 candidates)
		{HallNo: "SF 103", CourseCode: "22AI502", RegisterNos: append(expandRange("7376242AD115", "7376242AD129"), expandRange("7376242AD131", "7376242AD135")...), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: SF 201 ---
		// S.No 39: B.Tech. IT - 22IT502 (20 candidates)
		{HallNo: "SF 201", CourseCode: "22IT502", RegisterNos: expandRange("7376242IT196", "7376242IT215"), Time: "01:30 PM – 04:30 PM"},
		// S.No 40: B.Tech. AD - 22AI502 (20 candidates)
		{HallNo: "SF 201", CourseCode: "22AI502", RegisterNos: expandRange("7376242AD136", "7376242AD155"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: SF 202 ---
		// S.No 41: B.Tech. IT - 22IT502 (20 candidates)
		{HallNo: "SF 202", CourseCode: "22IT502", RegisterNos: expandRange("7376242IT216", "7376242IT235"), Time: "01:30 PM – 04:30 PM"},
		// S.No 42: B.Tech. AD - 22AI502 (20 candidates)
		{HallNo: "SF 202", CourseCode: "22AI502", RegisterNos: append(expandRange("7376242AD156", "7376242AD174"), []string{"7376242AD176"}...), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: SF B02 ---
		// S.No 43: B.Tech. IT - 22IT502 (20 candidates)
		{HallNo: "SF B02", CourseCode: "22IT502", RegisterNos: expandRange("7376242IT236", "7376242IT255"), Time: "01:30 PM – 04:30 PM"},
		// S.No 44: B.Tech. AD - 22AI502 (20 candidates)
		{HallNo: "SF B02", CourseCode: "22AI502", RegisterNos: append(expandRange("7376242AD177", "7376242AD186"), expandRange("7376242AD188", "7376242AD197")...), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: SF B03 ---
		// S.No 45: B.Tech. IT - 22IT502 (20 candidates)
		{HallNo: "SF B03", CourseCode: "22IT502", RegisterNos: expandRange("7376242IT256", "7376242IT275"), Time: "01:30 PM – 04:30 PM"},
		// S.No 46: B.Tech. AD - 22AI502 (20 candidates)
		{HallNo: "SF B03", CourseCode: "22AI502", RegisterNos: expandRange("7376242AD198", "7376242AD217"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 008 ---
		// S.No 47: B.Tech. IT - 22IT502 (10 candidates)
		{HallNo: "WW 008", CourseCode: "22IT502", RegisterNos: expandRange("7376242IT276", "7376242IT285"), Time: "01:30 PM – 04:30 PM"},
		// S.No 48: B.Tech. AD - 22AI502 (15 candidates)
		{HallNo: "WW 008", CourseCode: "22AI502", RegisterNos: expandRange("7376242AD218", "7376242AD232"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 011 ---
		// S.No 49: B.Tech. IT - 22IT502 (10 candidates)
		{HallNo: "WW 011", CourseCode: "22IT502", RegisterNos: expandRange("7376242IT286", "7376242IT295"), Time: "01:30 PM – 04:30 PM"},
		// S.No 50: B.Tech. AD - 22AI502 (15 candidates)
		{HallNo: "WW 011", CourseCode: "22AI502", RegisterNos: expandRange("7376242AD233", "7376242AD247"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 012 ---
		// S.No 51: B.Tech. IT - 22IT502 (10 candidates)
		{HallNo: "WW 012", CourseCode: "22IT502", RegisterNos: append(expandRange("7376242IT296", "7376242IT303"), []string{"7376242IT305", "7376242IT306"}...), Time: "01:30 PM – 04:30 PM"},
		// S.No 52: B.Tech. AD - 22AI502 (15 candidates)
		{HallNo: "WW 012", CourseCode: "22AI502", RegisterNos: expandRange("7376242AD248", "7376242AD262"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 113 ---
		// S.No 53: B.Tech. IT - 22IT502 (10 candidates)
		{HallNo: "WW 113", CourseCode: "22IT502", RegisterNos: expandRange("7376242IT307", "7376242IT316"), Time: "01:30 PM – 04:30 PM"},
		// S.No 54: B.Tech. AD - 22AI502 (15 candidates)
		{HallNo: "WW 113", CourseCode: "22AI502", RegisterNos: expandRange("7376242AD263", "7376242AD277"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 114 ---
		// S.No 55: B.Tech. IT - 22IT502 (10 candidates)
		{HallNo: "WW 114", CourseCode: "22IT502", RegisterNos: expandRange("7376242IT317", "7376242IT326"), Time: "01:30 PM – 04:30 PM"},
		// S.No 56: B.Tech. AD - 22AI502 (15 candidates)
		{HallNo: "WW 114", CourseCode: "22AI502", RegisterNos: expandRange("7376242AD278", "7376242AD292"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 115 ---
		// S.No 57: B.Tech. IT - 22IT502 (10 candidates)
		{HallNo: "WW 115", CourseCode: "22IT502", RegisterNos: expandRange("7376242IT327", "7376242IT336"), Time: "01:30 PM – 04:30 PM"},
		// S.No 58: B.Tech. AD - 22AI502 (15 candidates)
		{HallNo: "WW 115", CourseCode: "22AI502", RegisterNos: expandRange("7376242AD293", "7376242AD307"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 117 ---
		// S.No 59: B.Tech. IT - 22IT502 (10 candidates)
		{HallNo: "WW 117", CourseCode: "22IT502", RegisterNos: expandRange("7376242IT337", "7376242IT346"), Time: "01:30 PM – 04:30 PM"},
		// S.No 60: B.Tech. AD - 22AI502 (15 candidates)
		{HallNo: "WW 117", CourseCode: "22AI502", RegisterNos: expandRange("7376242AD308", "7376242AD322"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 118 ---
		// S.No 61: B.Tech. IT - 22IT502 (10 candidates)
		{HallNo: "WW 118", CourseCode: "22IT502", RegisterNos: append(expandRange("7376242IT347", "7376242IT351"), expandRange("7376252IT501", "7376252IT505")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 62: B.Tech. AD - 22AI502 (15 candidates)
		{HallNo: "WW 118", CourseCode: "22AI502", RegisterNos: expandRange("7376242AD323", "7376242AD337"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 202 ---
		// S.No 63: B.E. EE - 22EE502 (15 candidates)
		{HallNo: "WW 202", CourseCode: "22EE502", RegisterNos: append(expandRange("7376241EE101", "7376241EE111"), expandRange("7376241EE113", "7376241EE116")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 64: B.Tech. IT - 22IT502 (10 candidates)
		{HallNo: "WW 202", CourseCode: "22IT502", RegisterNos: append([]string{"7376252IT506"}, expandRange("7376252IT508", "7376252IT516")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 65: B.Tech. AD - 22AI502 (25 candidates)
		{HallNo: "WW 202", CourseCode: "22AI502", RegisterNos: append(expandRange("7376242AD338", "7376242AD346"), expandRange("7376252AD501", "7376252AD516")...), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 203 ---
		// S.No 66: B.E. EE - 22EE502 (10 candidates)
		{HallNo: "WW 203", CourseCode: "22EE502", RegisterNos: expandRange("7376241EE117", "7376241EE126"), Time: "01:30 PM – 04:30 PM"},
		// S.No 67: B.Tech. AL - 22AM502 (15 candidates)
		{HallNo: "WW 203", CourseCode: "22AM502", RegisterNos: expandRange("7376242AL101", "7376242AL115"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 204 ---
		// S.No 68: B.E. EE - 22EE502 (10 candidates)
		{HallNo: "WW 204", CourseCode: "22EE502", RegisterNos: expandRange("7376241EE127", "7376241EE136"), Time: "01:30 PM – 04:30 PM"},
		// S.No 69: B.Tech. AL - 22AM502 (15 candidates)
		{HallNo: "WW 204", CourseCode: "22AM502", RegisterNos: expandRange("7376242AL116", "7376242AL130"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 205 ---
		// S.No 70: B.E. EE - 22EE502 (10 candidates)
		{HallNo: "WW 205", CourseCode: "22EE502", RegisterNos: expandRange("7376241EE137", "7376241EE146"), Time: "01:30 PM – 04:30 PM"},
		// S.No 71: B.Tech. AL - 22AM502 (15 candidates)
		{HallNo: "WW 205", CourseCode: "22AM502", RegisterNos: expandRange("7376242AL131", "7376242AL145"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 206 ---
		// S.No 72: B.E. EE - 22EE502 (10 candidates)
		{HallNo: "WW 206", CourseCode: "22EE502", RegisterNos: expandRange("7376241EE147", "7376241EE156"), Time: "01:30 PM – 04:30 PM"},
		// S.No 73: B.Tech. AL - 22AM502 (15 candidates)
		{HallNo: "WW 206", CourseCode: "22AM502", RegisterNos: expandRange("7376242AL146", "7376242AL160"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 207 ---
		// S.No 74: B.E. EE - 22EE502 (25 candidates)
		{HallNo: "WW 207", CourseCode: "22EE502", RegisterNos: append(expandRange("7376241EE157", "7376241EE171"), expandRange("7376241EE173", "7376241EE182")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 75: B.Tech. AL - 22AM502 (25 candidates)
		{HallNo: "WW 207", CourseCode: "22AM502", RegisterNos: expandRange("7376242AL161", "7376242AL185"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 208 ---
		// S.No 76: B.E. EE - 22EE502 (10 candidates)
		{HallNo: "WW 208", CourseCode: "22EE502", RegisterNos: expandRange("7376241EE183", "7376241EE192"), Time: "01:30 PM – 04:30 PM"},
		// S.No 77: B.Tech. AL - 22AM502 (15 candidates)
		{HallNo: "WW 208", CourseCode: "22AM502", RegisterNos: expandRange("7376242AL186", "7376242AL200"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 209 ---
		// S.No 78: B.E. EE - 22EE502 (10 candidates)
		{HallNo: "WW 209", CourseCode: "22EE502", RegisterNos: expandRange("7376241EE193", "7376241EE202"), Time: "01:30 PM – 04:30 PM"},
		// S.No 79: B.Tech. AL - 22AM502 (15 candidates)
		{HallNo: "WW 209", CourseCode: "22AM502", RegisterNos: append(expandRange("7376242AL201", "7376242AL206"), expandRange("7376242AL208", "7376242AL216")...), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 210 ---
		// S.No 80: B.E. EE - 22EE502 (10 candidates)
		{HallNo: "WW 210", CourseCode: "22EE502", RegisterNos: expandRange("7376241EE203", "7376241EE212"), Time: "01:30 PM – 04:30 PM"},
		// S.No 81: B.Tech. BT - 22BT502 (5 candidates)
		{HallNo: "WW 210", CourseCode: "22BT502", RegisterNos: expandRange("7376242BT102", "7376242BT106"), Time: "01:30 PM – 04:30 PM"},
		// S.No 82: B.Tech. AL - 22AM502 (10 candidates)
		{HallNo: "WW 210", CourseCode: "22AM502", RegisterNos: append(expandRange("7376242AL217", "7376242AL223"), expandRange("7376252AL501", "7376252AL503")...), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 211 ---
		// S.No 83: B.E. EE - 22EE502 (10 candidates)
		{HallNo: "WW 211", CourseCode: "22EE502", RegisterNos: append(expandRange("7376241EE213", "7376241EE217"), expandRange("7376251EE501", "7376251EE505")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 84: B.Tech. BT - 22BT502 (15 candidates)
		{HallNo: "WW 211", CourseCode: "22BT502", RegisterNos: expandRange("7376242BT107", "7376242BT121"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 212 ---
		// S.No 85: B.E. EE - 22EE502 (12 candidates)
		{HallNo: "WW 212", CourseCode: "22EE502", RegisterNos: expandRange("7376251EE506", "7376251EE517"), Time: "01:30 PM – 04:30 PM"},
		// S.No 86: B.E. MZ - 22MC502 (13 candidates)
		{HallNo: "WW 212", CourseCode: "22MC502", RegisterNos: expandRange("7376241MZ101", "7376241MZ113"), Time: "01:30 PM – 04:30 PM"},
		// S.No 87: B.Tech. BT - 22BT502 (25 candidates)
		{HallNo: "WW 212", CourseCode: "22BT502", RegisterNos: expandRange("7376242BT122", "7376242BT146"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 213 ---
		// S.No 88: B.E. MZ - 22MC502 (10 candidates)
		{HallNo: "WW 213", CourseCode: "22MC502", RegisterNos: expandRange("7376241MZ114", "7376241MZ123"), Time: "01:30 PM – 04:30 PM"},
		// S.No 89: B.Tech. BT - 22BT502 (15 candidates)
		{HallNo: "WW 213", CourseCode: "22BT502", RegisterNos: append(expandRange("7376242BT147", "7376242BT160"), []string{"7376242BT162"}...), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 214 ---
		// S.No 90: B.E. MZ - 22MC502 (10 candidates)
		{HallNo: "WW 214", CourseCode: "22MC502", RegisterNos: expandRange("7376241MZ124", "7376241MZ133"), Time: "01:30 PM – 04:30 PM"},
		// S.No 91: B.Tech. BT - 22BT502 (15 candidates)
		{HallNo: "WW 214", CourseCode: "22BT502", RegisterNos: expandRange("7376242BT163", "7376242BT177"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 215 ---
		// S.No 92: B.E. MZ - 22MC502 (10 candidates)
		{HallNo: "WW 215", CourseCode: "22MC502", RegisterNos: expandRange("7376241MZ134", "7376241MZ143"), Time: "01:30 PM – 04:30 PM"},
		// S.No 93: B.Tech. BT - 22BT502 (15 candidates)
		{HallNo: "WW 215", CourseCode: "22BT502", RegisterNos: expandRange("7376242BT178", "7376242BT192"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 218 ---
		// S.No 94: B.E. MZ - 22MC502 (10 candidates)
		{HallNo: "WW 218", CourseCode: "22MC502", RegisterNos: expandRange("7376241MZ144", "7376241MZ153"), Time: "01:30 PM – 04:30 PM"},
		// S.No 95: B.Tech. BT - 22BT502 (15 candidates)
		{HallNo: "WW 218", CourseCode: "22BT502", RegisterNos: expandRange("7376242BT193", "7376242BT207"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 219 ---
		// S.No 96: B.E. MZ - 22MC502 (10 candidates)
		{HallNo: "WW 219", CourseCode: "22MC502", RegisterNos: append(expandRange("7376241MZ154", "7376241MZ160"), expandRange("7376251MZ501", "7376251MZ503")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 97: B.Tech. BT - 22BT502 (15 candidates)
		{HallNo: "WW 219", CourseCode: "22BT502", RegisterNos: append(append(expandRange("7376242BT208", "7376242BT218"), expandRange("7376242BT220", "7376242BT222")...), []string{"7376252BT501"}...), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 222 ---
		// S.No 98: B.E. EI - 22EI502 (22 candidates)
		{HallNo: "WW 222", CourseCode: "22EI502", RegisterNos: expandRange("7376241EI101", "7376241EI122"), Time: "01:30 PM – 04:30 PM"},
		// S.No 99: B.E. ME - 22ME502 (25 candidates)
		{HallNo: "WW 222", CourseCode: "22ME502", RegisterNos: append(expandRange("7376241ME102", "7376241ME109"), expandRange("7376241ME111", "7376241ME127")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 100: B.E. MZ - 22MC502 (3 candidates)
		{HallNo: "WW 222", CourseCode: "22MC502", RegisterNos: expandRange("7376251MZ504", "7376251MZ506"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 223 ---
		// S.No 101: B.E. EI - 22EI502 (25 candidates)
		{HallNo: "WW 223", CourseCode: "22EI502", RegisterNos: append(expandRange("7376241EI123", "7376241EI125"), expandRange("7376241EI127", "7376241EI148")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 102: B.E. ME - 22ME502 (25 candidates)
		{HallNo: "WW 223", CourseCode: "22ME502", RegisterNos: append(expandRange("7376241ME128", "7376241ME132"), expandRange("7376241ME134", "7376241ME153")...), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 224 ---
		// S.No 103: B.E. EI - 22EI502 (14 candidates)
		{HallNo: "WW 224", CourseCode: "22EI502", RegisterNos: append(expandRange("7376241EI149", "7376241EI160"), []string{"7376251EI501", "7376251EI502"}...), Time: "01:30 PM – 04:30 PM"},
		// S.No 104: B.E. ME - 22ME502 (14 candidates)
		{HallNo: "WW 224", CourseCode: "22ME502", RegisterNos: append(expandRange("7376241ME154", "7376241ME159"), expandRange("7376251ME501", "7376251ME508")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 105: B.Tech. CB - 22CB502 (11 candidates)
		{HallNo: "WW 224", CourseCode: "22CB502", RegisterNos: append(expandRange("7376242CB102", "7376242CB105"), expandRange("7376242CB107", "7376242CB113")...), Time: "01:30 PM – 04:30 PM"},
		// S.No 106: B.Tech. AG - 22AG502 (11 candidates)
		{HallNo: "WW 224", CourseCode: "22AG502", RegisterNos: expandRange("7376242AG101", "7376242AG111"), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 225 ---
		// S.No 107: B.Tech. CB - 22CB502 (35 candidates)
		{HallNo: "WW 225", CourseCode: "22CB502", RegisterNos: expandRange("7376242CB114", "7376242CB148"), Time: "01:30 PM – 04:30 PM"},
		// S.No 108: B.Tech. AG - 22AG502 (15 candidates)
		{HallNo: "WW 225", CourseCode: "22AG502", RegisterNos: append(expandRange("7376242AG112", "7376242AG124"), []string{"7376252AG501", "7376252AG502"}...), Time: "01:30 PM – 04:30 PM"},
		// --- Hall: WW 226 ---
		// S.No 109: B.Tech. CB - 22CB502 (14 candidates)
		{HallNo: "WW 226", CourseCode: "22CB502", RegisterNos: append(expandRange("7376242CB149", "7376242CB159"), expandRange("7376252CB501", "7376252CB503")...), Time: "01:30 PM – 04:30 PM"},
	}
}
