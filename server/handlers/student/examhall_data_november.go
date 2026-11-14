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
