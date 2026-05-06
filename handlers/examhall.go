package handlers

import (
	"fmt"
	"strconv"
	"strings"

	"server/models"
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

// buildSeatingData returns all seating records from the April 2026 FN exam
// Exam Date: 04-05-2026 | Session: FN - 09:00 AM to 12:00 PM
func buildSeatingData() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.Tech CB - 22CB604
		{HallNo: "EW 101", CourseCode: "22CB604", RegisterNos: []string{"7376222CB121"}},

		// S.No 2 - EW 101 - B.Tech CB - 22CB604
		{HallNo: "EW 101", CourseCode: "22CB604", RegisterNos: expandRange("7376232CB101", "7376232CB109")},

		// S.No 3 - EW 101 - B.Tech AL - 22AM006
		{HallNo: "EW 101", CourseCode: "22AM006", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AL101", "7376232AL102")
			r = append(r, expandRange("7376232AL105", "7376232AL109")...)
			r = append(r, "7376232AL111")
			r = append(r, expandRange("7376232AL113", "7376232AL115")...)
			r = append(r, "7376232AL118")
			r = append(r, expandRange("7376232AL121", "7376232AL123")...)
			return r
		}()},

		// S.No 4 - EW 102 - B.Tech CB - 22CB604
		{HallNo: "EW 102", CourseCode: "22CB604", RegisterNos: expandRange("7376232CB110", "7376232CB119")},

		// S.No 5 - EW 102 - B.Tech AL - 22AM006
		{HallNo: "EW 102", CourseCode: "22AM006", RegisterNos: []string{
			"7376232AL124", "7376232AL125", "7376232AL127", "7376232AL128",
			"7376232AL130", "7376232AL133", "7376232AL139", "7376232AL140",
			"7376232AL143", "7376232AL145", "7376232AL147", "7376232AL150",
			"7376232AL152", "7376232AL156", "7376232AL159",
		}},

		// S.No 6 - EW 103 - B.Tech CB - 22CB604
		{HallNo: "EW 103", CourseCode: "22CB604", RegisterNos: expandRange("7376232CB120", "7376232CB129")},

		// S.No 7 - EW 103 - B.Tech AL - 22AM006
		{HallNo: "EW 103", CourseCode: "22AM006", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AL160", "7376232AL161", "7376232AL163", "7376232AL164")
			r = append(r, expandRange("7376232AL166", "7376232AL168")...)
			r = append(r, "7376232AL171", "7376232AL174", "7376232AL176")
			r = append(r, expandRange("7376232AL180", "7376232AL184")...)
			return r
		}()},

		// S.No 8 - EW 104 - B.Tech CB - 22CB604
		{HallNo: "EW 104", CourseCode: "22CB604", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232CB130", "7376232CB137")...)
			r = append(r, "7376232CB139", "7376232CB140")
			return r
		}()},

		// S.No 9 - EW 104 - B.Tech AL - 22AM006
		{HallNo: "EW 104", CourseCode: "22AM006", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AL185")
			r = append(r, expandRange("7376232AL189", "7376232AL193")...)
			r = append(r, "7376232AL196", "7376232AL197")
			r = append(r, expandRange("7376232AL199", "7376232AL201")...)
			r = append(r, "7376232AL204", "7376232AL208", "7376232AL210", "7376232AL212")
			return r
		}()},

		// S.No 10 - EW 105 - B.Tech AL - 22AM006
		{HallNo: "EW 105", CourseCode: "22AM006", RegisterNos: []string{"7376232AL510"}},

		// S.No 11 - EW 105 - B.Tech CB - 22CB604
		{HallNo: "EW 105", CourseCode: "22CB604", RegisterNos: expandRange("7376232CB141", "7376232CB150")},

		// S.No 12 - EW 105 - B.Tech AD - 22AI036
		{HallNo: "EW 105", CourseCode: "22AI036", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD107", "7376232AD110", "7376232AD112")
			r = append(r, expandRange("7376232AD123", "7376232AD125")...)
			r = append(r, "7376232AD134")
			r = append(r, expandRange("7376232AD137", "7376232AD139")...)
			return r
		}()},

		// S.No 13 - EW 105 - B.Tech AL - 22AM006
		{HallNo: "EW 105", CourseCode: "22AM006", RegisterNos: []string{
			"7376232AL214", "7376232AL216", "7376232AL218", "7376232AL219",
		}},

		// S.No 14 - EW 106 - B.Tech CB - 22CB604
		{HallNo: "EW 106", CourseCode: "22CB604", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232CB151", "7376232CB157")...)
			r = append(r, expandRange("7376232CB159", "7376232CB161")...)
			return r
		}()},

		// S.No 15 - EW 106 - B.Tech AD - 22AI036
		{HallNo: "EW 106", CourseCode: "22AI036", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD146", "7376232AD152", "7376232AD158", "7376232AD161", "7376232AD167")
			r = append(r, expandRange("7376232AD169", "7376232AD171")...)
			r = append(r, expandRange("7376232AD174", "7376232AD176")...)
			r = append(r, "7376232AD182", "7376232AD187", "7376232AD195", "7376232AD196")
			return r
		}()},

		// S.No 16 - EW 201 - B.Tech BT - 22BT004
		{HallNo: "EW 201", CourseCode: "22BT004", RegisterNos: []string{
			"7376222BT110", "7376222BT152", "7376222BT193", "7376222BT215",
		}},

		// S.No 17 - EW 201 - B.Tech BT - 22BT004
		{HallNo: "EW 201", CourseCode: "22BT004", RegisterNos: []string{
			"7376232BT114", "7376232BT118",
		}},

		// S.No 18 - EW 201 - B.Tech CB - 22CB604
		{HallNo: "EW 201", CourseCode: "22CB604", RegisterNos: []string{
			"7376232CB162", "7376232CB163", "7376242CB502", "7376242CB503",
		}},

		// S.No 19 - EW 201 - B.Tech AD - 22AI036
		{HallNo: "EW 201", CourseCode: "22AI036", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD201", "7376232AD212")
			r = append(r, expandRange("7376232AD221", "7376232AD223")...)
			r = append(r, "7376232AD233", "7376232AD235", "7376232AD239")
			r = append(r, expandRange("7376232AD241", "7376232AD243")...)
			r = append(r, "7376232AD262", "7376232AD266", "7376232AD273", "7376232AD275")
			return r
		}()},

		// S.No 20 - EW 202 - B.E. MZ - 22MC011
		{HallNo: "EW 202", CourseCode: "22MC011", RegisterNos: []string{
			"7376231MZ102", "7376231MZ104", "7376231MZ106", "7376231MZ107",
			"7376231MZ113", "7376231MZ119", "7376231MZ122", "7376231MZ132",
			"7376231MZ137", "7376231MZ138", "7376231MZ142", "7376231MZ145",
			"7376231MZ148",
		}},

		// S.No 21 - EW 202 - B.Tech BT - 22BT004
		{HallNo: "EW 202", CourseCode: "22BT004", RegisterNos: []string{
			"7376232BT124", "7376232BT140", "7376232BT142", "7376232BT143",
			"7376232BT149", "7376232BT169", "7376232BT171", "7376232BT175",
			"7376232BT178", "7376232BT181",
		}},

		// S.No 22 - EW 202 - B.Tech AD - 22AI036
		{HallNo: "EW 202", CourseCode: "22AI036", RegisterNos: []string{
			"7376232AD282", "7376232AD286",
		}},

		// S.No 23 - EW 206 - B.E. CS - 22CS012
		{HallNo: "EW 206", CourseCode: "22CS012", RegisterNos: []string{
			"7376221CS229", "7376221CS240", "7376231CS514", "7376231CS522",
		}},

		// S.No 24 - EW 206 - B.E. ME - 22ME041
		{HallNo: "EW 206", CourseCode: "22ME041", RegisterNos: []string{
			"7376221ME114", "7376221ME138",
		}},

		// S.No 25 - EW 206 - B.E. MC - 22MC011
		{HallNo: "EW 206", CourseCode: "22MC011", RegisterNos: []string{
			"7376231MC506", "7376231MC509",
		}},

		// S.No 26 - EW 206 - B.E. SE - 22IS024
		{HallNo: "EW 206", CourseCode: "22IS024", RegisterNos: []string{
			"7376221SE123", "7376221SE134", "7376221SE140", "7376231SE503", "7376231SE504",
		}},

		// S.No 27 - EW 206 - B.E. CD - 22CD012
		{HallNo: "EW 206", CourseCode: "22CD012", RegisterNos: []string{
			"7376221CD114", "7376221CD144", "7376221CD153", "7376231CD503",
		}},

		// S.No 28 - EW 206 - B.Tech IT - 22IT012
		{HallNo: "EW 206", CourseCode: "22IT012", RegisterNos: []string{
			"7376222IT110",
		}},

		// S.No 29 - EW 206 - B.Tech AL - 22AM035
		{HallNo: "EW 206", CourseCode: "22AM035", RegisterNos: []string{
			"7376222AL152", "7376222AL169",
		}},

		// S.No 30 - EW 206 - B.E. MZ - 22MC011
		{HallNo: "EW 206", CourseCode: "22MC011", RegisterNos: []string{
			"7376231MZ151", "7376231MZ152",
		}},

		// S.No 31 - EW 206 - B.Tech BT - 22BT004
		{HallNo: "EW 206", CourseCode: "22BT004", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232BT183", "7376232BT189")
			r = append(r, expandRange("7376232BT194", "7376232BT197")...)
			r = append(r, "7376232BT201", "7376232BT203", "7376232BT205", "7376232BT206",
				"7376232BT210", "7376232BT214")
			return r
		}()},
	}
}

// buildSeatingDataAN returns all seating records from the April 2026 AN exam
// Exam Date: 04-05-2026 | Session: AN - 01:30 PM to 04:30 PM
func buildSeatingDataAN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.E. CS - 22CS501
		{HallNo: "EW 101", CourseCode: "22CS501", RegisterNos: []string{
			"7376221CS196", "7376221CS288",
		}},

		// S.No 2 - EW 101 - B.E. EC - 22EC501
		{HallNo: "EW 101", CourseCode: "22EC501", RegisterNos: []string{
			"7376221EC102", "7376221EC107", "7376221EC116", "7376221EC131",
			"7376221EC226", "7376221EC290",
		}},

		// S.No 3 - EW 101 - B.E. CS - 22CS501
		{HallNo: "EW 101", CourseCode: "22CS501", RegisterNos: []string{
			"7376231CS102", "7376231CS121", "7376231CS139", "7376231CS190",
			"7376231CS235", "7376231CS244", "7376231CS259", "7376231CS263",
		}},

		// S.No 4 - EW 101 - B.E. EC - 22EC501
		{HallNo: "EW 101", CourseCode: "22EC501", RegisterNos: []string{
			"7376231EC101", "7376231EC131", "7376231EC222", "7376231EC231",
			"7376231EC283", "7376231EC297", "7376231EC305", "7376231EC331",
			"7376231EC334",
		}},

		// S.No 5 - EW 102 - B.E. EC - 22EC501
		{HallNo: "EW 102", CourseCode: "22EC501", RegisterNos: []string{
			"7376231EC507", "7376231EC514",
		}},

		// S.No 6 - EW 102 - B.Tech. BT - 22BT501
		{HallNo: "EW 102", CourseCode: "22BT501", RegisterNos: []string{
			"7376222BT110",
		}},

		// S.No 7 - EW 102 - B.Tech. IT - 22IT501
		{HallNo: "EW 102", CourseCode: "22IT501", RegisterNos: []string{
			"7376222IT110", "7376222IT261",
		}},

		// S.No 8 - EW 102 - B.E. CS - 22CS501
		{HallNo: "EW 102", CourseCode: "22CS501", RegisterNos: []string{
			"7376231CS292", "7376231CS346", "7376241CS504", "7376241CS506",
			"7376241CS512",
		}},

		// S.No 9 - EW 102 - B.E. EC - 22EC501
		{HallNo: "EW 102", CourseCode: "22EC501", RegisterNos: []string{
			"7376241EC504", "7376241EC505", "7376241EC513", "7376241EC515",
			"7376241EC516", "7376241EC520",
		}},

		// S.No 10 - EW 102 - B.Tech. BT - 22BT501
		{HallNo: "EW 102", CourseCode: "22BT501", RegisterNos: []string{
			"7376232BT115", "7376232BT134", "7376232BT142", "7376232BT148",
		}},

		// S.No 11 - EW 102 - B.Tech. IT - 22IT501
		{HallNo: "EW 102", CourseCode: "22IT501", RegisterNos: []string{
			"7376232IT118", "7376232IT139", "7376232IT152", "7376232IT224",
			"7376232IT274",
		}},

		// S.No 12 - EW 103 - B.E. BM - 22BM501
		{HallNo: "EW 103", CourseCode: "22BM501", RegisterNos: []string{
			"7376221BM128", "7376231BM502",
		}},

		// S.No 13 - EW 103 - B.Tech. IT - 22IT501
		{HallNo: "EW 103", CourseCode: "22IT501", RegisterNos: []string{
			"7376232IT502",
		}},

		// S.No 14 - EW 103 - B.Tech. CT - 22CT501
		{HallNo: "EW 103", CourseCode: "22CT501", RegisterNos: []string{
			"7376232CT501", "7376232CT504",
		}},

		// S.No 15 - EW 103 - B.Tech. AG - 22AG501
		{HallNo: "EW 103", CourseCode: "22AG501", RegisterNos: []string{
			"7376222AG120", "7376222AG157",
		}},

		// S.No 16 - EW 103 - B.E. BM - 22BM501
		{HallNo: "EW 103", CourseCode: "22BM501", RegisterNos: []string{
			"7376231BM107", "7376231BM148",
		}},

		// S.No 17 - EW 103 - B.E. MZ - 22MC501
		{HallNo: "EW 103", CourseCode: "22MC501", RegisterNos: []string{
			"7376231MZ106",
		}},

		// S.No 18 - EW 103 - B.Tech. BT - 22BT501
		{HallNo: "EW 103", CourseCode: "22BT501", RegisterNos: []string{
			"7376232BT176",
		}},

		// S.No 19 - EW 103 - B.Tech. IT - 22IT501
		{HallNo: "EW 103", CourseCode: "22IT501", RegisterNos: []string{
			"7376242IT502", "7376242IT509",
		}},

		// S.No 20 - EW 103 - B.Tech. CB - 22CB501
		{HallNo: "EW 103", CourseCode: "22CB501", RegisterNos: []string{
			"7376232CB110", "7376232CB111", "7376232CB120", "7376232CB123",
			"7376232CB133",
		}},

		// S.No 21 - EW 103 - B.Tech. CT - 22CT501
		{HallNo: "EW 103", CourseCode: "22CT501", RegisterNos: []string{
			"7376232CT122", "7376232CT127", "7376232CT144", "7376242CT503",
		}},

		// S.No 22 - EW 103 - B.Tech. AG - 22AG501
		{HallNo: "EW 103", CourseCode: "22AG501", RegisterNos: []string{
			"7376232AG132", "7376232AG153", "7376242AG502",
		}},

		// S.No 23 - EW 104 - B.E. CE - 22CE501
		{HallNo: "EW 104", CourseCode: "22CE501", RegisterNos: []string{
			"7376221CE124",
		}},

		// S.No 24 - EW 104 - B.E. SE - 22IS501
		{HallNo: "EW 104", CourseCode: "22IS501", RegisterNos: []string{
			"7376221SE134", "7376231SE504",
		}},

		// S.No 25 - EW 104 - B.E. CD - 22CD501
		{HallNo: "EW 104", CourseCode: "22CD501", RegisterNos: []string{
			"7376221CD114",
		}},

		// S.No 26 - EW 104 - B.Tech. FD - 22FD501
		{HallNo: "EW 104", CourseCode: "22FD501", RegisterNos: []string{
			"7376222FD107", "7376222FD125",
		}},

		// S.No 27 - EW 104 - B.Tech. TT - 22TT501
		{HallNo: "EW 104", CourseCode: "22TT501", RegisterNos: []string{
			"7376222TX133",
		}},

		// S.No 28 - EW 104 - B.Tech. AD - 22AI501
		{HallNo: "EW 104", CourseCode: "22AI501", RegisterNos: []string{
			"7376232AD502",
		}},

		// S.No 29 - EW 104 - B.E. CE - 22CE501
		{HallNo: "EW 104", CourseCode: "22CE501", RegisterNos: []string{
			"7376241CE501",
		}},

		// S.No 30 - EW 104 - B.E. EE - 22EE501
		{HallNo: "EW 104", CourseCode: "22EE501", RegisterNos: []string{
			"7376231EE104", "7376231EE111",
		}},

		// S.No 31 - EW 104 - B.E. ME - 22ME501
		{HallNo: "EW 104", CourseCode: "22ME501", RegisterNos: []string{
			"7376231ME130", "7376241ME501",
		}},

		// S.No 32 - EW 104 - B.E. CD - 22CD501
		{HallNo: "EW 104", CourseCode: "22CD501", RegisterNos: []string{
			"7376241CD501", "7376241CD502",
		}},

		// S.No 33 - EW 104 - B.E. MZ - 22MC501
		{HallNo: "EW 104", CourseCode: "22MC501", RegisterNos: []string{
			"7376231MZ107", "7376231MZ111", "7376241MZ501",
		}},

		// S.No 34 - EW 104 - B.Tech. FD - 22FD501
		{HallNo: "EW 104", CourseCode: "22FD501", RegisterNos: []string{
			"7376232FD137",
		}},

		// S.No 35 - EW 104 - B.Tech. AD - 22AI501
		{HallNo: "EW 104", CourseCode: "22AI501", RegisterNos: []string{
			"7376232AD250", "7376232AD282",
		}},
	}
}

// buildSeatingData05FN returns all seating records from the 05-05-2026 FN exam
// Exam Date: 05-05-2026 | Session: FN - 09:00 AM to 12:00 PM
func buildSeatingData05FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.Tech. IT - 22IT007
		{HallNo: "EW 101", CourseCode: "22IT007", RegisterNos: []string{
			"7376222IT110",
		}},

		// S.No 2 - EW 101 - B.Tech. CB - 22CB406
		{HallNo: "EW 101", CourseCode: "22CB406", RegisterNos: []string{
			"7376232CB106", "7376232CB123", "7376232CB133",
		}},

		// S.No 3 - EW 101 - B.Tech. IT - 22IT007
		{HallNo: "EW 101", CourseCode: "22IT007", RegisterNos: []string{
			"7376242IT101", "7376242IT117", "7376242IT122", "7376242IT123",
			"7376242IT125", "7376242IT136", "7376242IT140", "7376242IT146",
			"7376242IT149",
		}},

		// S.No 4 - EW 101 - B.Tech. CB - 22CB406
		{HallNo: "EW 101", CourseCode: "22CB406", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242CB102", "7376242CB105")...)
			r = append(r, expandRange("7376242CB107", "7376242CB114")...)
			return r
		}()},

		// S.No 5 - EW 102 - B.Tech. IT - 22IT007
		{HallNo: "EW 102", CourseCode: "22IT007", RegisterNos: []string{
			"7376242IT150", "7376242IT153", "7376242IT158", "7376242IT160",
			"7376242IT161", "7376242IT165", "7376242IT179", "7376242IT182",
			"7376242IT183", "7376242IT214",
		}},

		// S.No 6 - EW 102 - B.Tech. CB - 22CB406
		{HallNo: "EW 102", CourseCode: "22CB406", RegisterNos: expandRange("7376242CB115", "7376242CB129")},

		// S.No 7 - EW 103 - B.Tech. IT - 22IT007
		{HallNo: "EW 103", CourseCode: "22IT007", RegisterNos: []string{
			"7376242IT218", "7376242IT227", "7376242IT232", "7376242IT237",
			"7376242IT239", "7376242IT240", "7376242IT242", "7376242IT244",
			"7376242IT245", "7376242IT252",
		}},

		// S.No 8 - EW 103 - B.Tech. CB - 22CB406
		{HallNo: "EW 103", CourseCode: "22CB406", RegisterNos: expandRange("7376242CB130", "7376242CB144")},

		// S.No 9 - EW 104 - B.Tech. IT - 22IT007
		{HallNo: "EW 104", CourseCode: "22IT007", RegisterNos: []string{
			"7376242IT255", "7376242IT258", "7376242IT276", "7376242IT279",
			"7376242IT298", "7376242IT307", "7376242IT309", "7376242IT315",
			"7376242IT320", "7376242IT344",
		}},

		// S.No 10 - EW 104 - B.Tech. CB - 22CB406
		{HallNo: "EW 104", CourseCode: "22CB406", RegisterNos: expandRange("7376242CB145", "7376242CB159")},

		// S.No 11 - EW 105 - B.E. SE - 22IS019
		{HallNo: "EW 105", CourseCode: "22IS019", RegisterNos: []string{
			"7376221SE134", "7376231SE504",
		}},

		// S.No 12 - EW 105 - B.E. CD - 22CD007
		{HallNo: "EW 105", CourseCode: "22CD007", RegisterNos: []string{
			"7376221CD114", "7376231CD503",
		}},

		// S.No 13 - EW 105 - B.E. CS - 22CS007
		{HallNo: "EW 105", CourseCode: "22CS007", RegisterNos: []string{
			"7376231CS102", "7376231CS190", "7376231CS235", "7376231CS244",
			"7376231CS259", "7376231CS292", "7376231CS346",
		}},

		// S.No 14 - EW 105 - B.Tech. CB - 22CB406
		{HallNo: "EW 105", CourseCode: "22CB406", RegisterNos: []string{
			"7376242CB502",
		}},

		// S.No 15 - EW 105 - B.Tech. CT - 22CT007
		{HallNo: "EW 105", CourseCode: "22CT007", RegisterNos: []string{
			"7376232CT122",
		}},

		// S.No 16 - EW 105 - B.E. CS - 22CS007
		{HallNo: "EW 105", CourseCode: "22CS007", RegisterNos: []string{
			"7376241CS134", "7376241CS145", "7376241CS149", "7376241CS157",
		}},

		// S.No 17 - EW 105 - B.Tech. IT - 22IT007
		{HallNo: "EW 105", CourseCode: "22IT007", RegisterNos: []string{
			"7376242IT351", "7376252IT508", "7376252IT512", "7376252IT513",
			"7376252IT516",
		}},

		// S.No 18 - EW 105 - B.Tech. CB - 22CB406
		{HallNo: "EW 105", CourseCode: "22CB406", RegisterNos: expandRange("7376252CB501", "7376252CB503")},

		// S.No 19 - EW 106 - B.E. CS - 22CS007
		{HallNo: "EW 106", CourseCode: "22CS007", RegisterNos: []string{
			"7376241CS159", "7376241CS161", "7376241CS168", "7376241CS177",
			"7376241CS179", "7376241CS180", "7376241CS206", "7376241CS218",
			"7376241CS230", "7376241CS264", "7376241CS297", "7376241CS319",
			"7376241CS322", "7376241CS335", "7376241CS345", "7376241CS418",
			"7376241CS420", "7376241CS465", "7376241CS468", "7376241CS471",
			"7376251CS501", "7376251CS509", "7376251CS510", "7376251CS512",
		}},
	}
}

// buildSeatingData05AN returns all seating records from the 05-05-2026 AN exam
// Exam Date: 05-05-2026 | Session: AN - 01:30 PM to 04:30 PM
func buildSeatingData05AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.E. CS - 22CS301
		{HallNo: "EW 101", CourseCode: "22CS301", RegisterNos: []string{
			"7376221CS118", "7376221CS196", "7376221CS240", "7376221CS275",
			"7376221CS288",
		}},

		// S.No 2 - EW 101 - B.Tech. IT - 22IT301
		{HallNo: "EW 101", CourseCode: "22IT301", RegisterNos: []string{
			"7376222IT110", "7376232IT504", "7376232IT507",
		}},

		// S.No 3 - EW 101 - B.E. CS - 22CS301
		{HallNo: "EW 101", CourseCode: "22CS301", RegisterNos: []string{
			"7376231CS102", "7376231CS103", "7376231CS139", "7376231CS173",
			"7376231CS190",
		}},

		// S.No 4 - EW 101 - B.Tech. IT - 22IT301
		{HallNo: "EW 101", CourseCode: "22IT301", RegisterNos: []string{
			"7376232IT113", "7376232IT118", "7376232IT139", "7376232IT146",
			"7376232IT152", "7376232IT228", "7376232IT282",
		}},

		// S.No 5 - EW 101 - B.Tech. IT - 22IT301
		{HallNo: "EW 101", CourseCode: "22IT301", RegisterNos: []string{
			"7376242IT107", "7376242IT108", "7376242IT110", "7376242IT123",
			"7376242IT124",
		}},

		// S.No 6 - EW 102 - B.E. CS - 22CS301
		{HallNo: "EW 102", CourseCode: "22CS301", RegisterNos: []string{
			"7376231CS235", "7376231CS244", "7376231CS251", "7376231CS259",
			"7376231CS269", "7376231CS292",
		}},

		// S.No 7 - EW 102 - B.E. CS - 22CS301
		{HallNo: "EW 102", CourseCode: "22CS301", RegisterNos: []string{
			"7376241CS141", "7376241CS143", "7376241CS144", "7376241CS150",
		}},

		// S.No 8 - EW 102 - B.Tech. IT - 22IT301
		{HallNo: "EW 102", CourseCode: "22IT301", RegisterNos: []string{
			"7376242IT126", "7376242IT129", "7376242IT141", "7376242IT146",
			"7376242IT155", "7376242IT161", "7376242IT164", "7376242IT168",
			"7376242IT183", "7376242IT184", "7376242IT188", "7376242IT214",
			"7376242IT217", "7376242IT220", "7376242IT227",
		}},

		// S.No 9 - EW 103 - B.E. CS - 22CS301
		{HallNo: "EW 103", CourseCode: "22CS301", RegisterNos: []string{
			"7376241CS503", "7376241CS504",
		}},

		// S.No 10 - EW 103 - B.Tech. IT - 22IT301
		{HallNo: "EW 103", CourseCode: "22IT301", RegisterNos: []string{
			"7376242IT502", "7376242IT506", "7376242IT509",
		}},

		// S.No 11 - EW 103 - B.E. CS - 22CS301
		{HallNo: "EW 103", CourseCode: "22CS301", RegisterNos: []string{
			"7376241CS318", "7376241CS358", "7376241CS359", "7376241CS395",
			"7376241CS409", "7376241CS410", "7376241CS450", "7376241CS473",
		}},

		// S.No 12 - EW 103 - B.Tech. IT - 22IT301
		{HallNo: "EW 103", CourseCode: "22IT301", RegisterNos: []string{
			"7376242IT345", "7376242IT348", "7376242IT351", "7376252IT501",
			"7376252IT502", "7376252IT503", "7376252IT504", "7376252IT505",
			"7376252IT506", "7376252IT507", "7376252IT508", "7376252IT509",
		}},

		// S.No 13 - EW 104 - B.E. MZ - 22MC301
		{HallNo: "EW 104", CourseCode: "22MC301", RegisterNos: []string{
			"7376231MZ106", "7376231MZ107", "7376231MZ111", "7376231MZ113",
			"7376231MZ114", "7376231MZ115", "7376231MZ119", "7376231MZ135",
		}},

		// S.No 14 - EW 104 - B.E. EC - 22EC301
		{HallNo: "EW 104", CourseCode: "22EC301", RegisterNos: []string{
			"7376251EC511", "7376251EC513", "7376251EC515", "7376251EC516",
			"7376251EC517", "7376251EC518", "7376251EC521",
		}},

		// S.No 15 - EW 104 - B.E. EE - 22EE301
		{HallNo: "EW 104", CourseCode: "22EE301", RegisterNos: []string{
			"7376241EE167", "7376241EE170", "7376241EE177", "7376241EE185",
			"7376241EE188", "7376241EE189", "7376241EE193", "7376241EE198",
			"7376241EE208", "7376241EE211",
		}},

		// S.No 16 - EW 105 - B.E. EE - 22EE301
		{HallNo: "EW 105", CourseCode: "22EE301", RegisterNos: []string{
			"7376241EE502", "7376241EE503",
		}},

		// S.No 17 - EW 105 - B.E. MZ - 22MC301
		{HallNo: "EW 105", CourseCode: "22MC301", RegisterNos: []string{
			"7376231MZ143", "7376231MZ145", "7376231MZ148",
		}},

		// S.No 18 - EW 105 - B.E. EE - 22EE301
		{HallNo: "EW 105", CourseCode: "22EE301", RegisterNos: []string{
			"7376251EE502", "7376251EE504", "7376251EE506", "7376251EE507",
			"7376251EE508", "7376251EE510", "7376251EE512", "7376251EE514",
		}},

		// S.No 19 - EW 105 - B.E. MZ - 22MC301
		{HallNo: "EW 105", CourseCode: "22MC301", RegisterNos: []string{
			"7376241MZ104", "7376241MZ105", "7376241MZ108", "7376241MZ112",
			"7376241MZ120", "7376241MZ121", "7376241MZ124", "7376241MZ127",
			"7376241MZ131", "7376241MZ137", "7376241MZ139", "7376241MZ143",
		}},

		// S.No 20 - EW 106 - B.E. EI - 22EI301
		{HallNo: "EW 106", CourseCode: "22EI301", RegisterNos: []string{
			"7376231EI501",
		}},

		// S.No 21 - EW 106 - B.E. EI - 22EI301
		{HallNo: "EW 106", CourseCode: "22EI301", RegisterNos: []string{
			"7376241EI501", "7376241EI503",
		}},

		// S.No 22 - EW 106 - B.Tech. BT - 22BT301
		{HallNo: "EW 106", CourseCode: "22BT301", RegisterNos: []string{
			"7376232BT200",
		}},

		// S.No 23 - EW 106 - B.E. EI - 22EI301
		{HallNo: "EW 106", CourseCode: "22EI301", RegisterNos: []string{
			"7376241EI101", "7376241EI104", "7376241EI106", "7376241EI111",
			"7376241EI119", "7376241EI123", "7376241EI133", "7376241EI142",
			"7376241EI146", "7376241EI160", "7376251EI501", "7376251EI502",
		}},

		// S.No 24 - EW 106 - B.Tech. BT - 22BT301
		{HallNo: "EW 106", CourseCode: "22BT301", RegisterNos: []string{
			"7376242BT120", "7376242BT138", "7376242BT145", "7376242BT151",
			"7376242BT156", "7376242BT160", "7376242BT174", "7376242BT178",
			"7376242BT182",
		}},

		// S.No 25 - EW 107 - B.E. CS - 22CS301
		{HallNo: "EW 107", CourseCode: "22CS301", RegisterNos: []string{
			"7376241CS151", "7376241CS157", "7376241CS171", "7376241CS190",
			"7376241CS196", "7376241CS230", "7376241CS257", "7376241CS272",
			"7376241CS279", "7376241CS308",
		}},

		// S.No 26 - EW 107 - B.Tech. IT - 22IT301
		{HallNo: "EW 107", CourseCode: "22IT301", RegisterNos: []string{
			"7376242IT250", "7376242IT257", "7376242IT273", "7376242IT277",
			"7376242IT278", "7376242IT287", "7376242IT292", "7376242IT293",
			"7376242IT297", "7376242IT300", "7376242IT318", "7376242IT336",
			"7376242IT337", "7376242IT339", "7376242IT341",
		}},

		// S.No 27 - EW 108 - B.E. CS - 22CS301
		{HallNo: "EW 108", CourseCode: "22CS301", RegisterNos: []string{
			"7376241CS506", "7376241CS508",
		}},

		// S.No 28 - EW 108 - B.E. EC - 22EC301
		{HallNo: "EW 108", CourseCode: "22EC301", RegisterNos: []string{
			"7376231EC101", "7376231EC110", "7376231EC112", "7376231EC196",
			"7376231EC283", "7376231EC297", "7376231EC305", "7376231EC331",
			"7376231EC334",
		}},

		// S.No 29 - EW 108 - B.E. CS - 22CS301
		{HallNo: "EW 108", CourseCode: "22CS301", RegisterNos: []string{
			"7376251CS501", "7376251CS502", "7376251CS503", "7376251CS505",
			"7376251CS508", "7376251CS509", "7376251CS510", "7376251CS512",
		}},

		// S.No 30 - EW 108 - B.Tech. IT - 22IT301
		{HallNo: "EW 108", CourseCode: "22IT301", RegisterNos: []string{
			"7376252IT510", "7376252IT511", "7376252IT512", "7376252IT513",
			"7376252IT514", "7376252IT515",
		}},

		// S.No 31 - EW 109 - B.E. EE - 22EE301
		{HallNo: "EW 109", CourseCode: "22EE301", RegisterNos: []string{
			"7376221EE147", "7376231EE504",
		}},

		// S.No 32 - EW 109 - B.E. EE - 22EE301
		{HallNo: "EW 109", CourseCode: "22EE301", RegisterNos: []string{
			"7376231EE111", "7376231EE115", "7376231EE149", "7376231EE159",
		}},

		// S.No 33 - EW 109 - B.E. CS - 22CS301
		{HallNo: "EW 109", CourseCode: "22CS301", RegisterNos: []string{
			"7376251CS518", "7376251CS521", "7376251CS522",
		}},

		// S.No 34 - EW 109 - B.E. EC - 22EC301
		{HallNo: "EW 109", CourseCode: "22EC301", RegisterNos: []string{
			"7376241EC124", "7376241EC133", "7376241EC137", "7376241EC138",
			"7376241EC139", "7376241EC142", "7376241EC145", "7376241EC147",
			"7376241EC151", "7376241EC160", "7376241EC163", "7376241EC177",
			"7376241EC201", "7376241EC243", "7376241EC256",
		}},

		// S.No 35 - EW 109 - B.E. EE - 22EE301
		{HallNo: "EW 109", CourseCode: "22EE301", RegisterNos: []string{
			"7376241EE115",
		}},

		// S.No 36 - EW 111 - B.E. EC - 22EC301
		{HallNo: "EW 111", CourseCode: "22EC301", RegisterNos: []string{
			"7376241EC511", "7376241EC513", "7376241EC516",
		}},

		// S.No 37 - EW 111 - B.E. EC - 22EC301
		{HallNo: "EW 111", CourseCode: "22EC301", RegisterNos: []string{
			"7376241EC273", "7376241EC282", "7376241EC284", "7376241EC300",
			"7376241EC312", "7376241EC321", "7376241EC328", "7376241EC333",
			"7376241EC334", "7376251EC506", "7376251EC507", "7376251EC509",
		}},

		// S.No 38 - EW 111 - B.E. EE - 22EE301
		{HallNo: "EW 111", CourseCode: "22EE301", RegisterNos: []string{
			"7376241EE127", "7376241EE130", "7376241EE132", "7376241EE137",
			"7376241EE145", "7376241EE146", "7376241EE147", "7376241EE153",
			"7376241EE157", "7376241EE160",
		}},

		// S.No 39 - EW 112 - B.E. EI - 22EI301
		{HallNo: "EW 112", CourseCode: "22EI301", RegisterNos: []string{
			"7376221EI114",
		}},

		// S.No 40 - EW 112 - B.Tech. BT - 22BT301
		{HallNo: "EW 112", CourseCode: "22BT301", RegisterNos: []string{
			"7376222BT110",
		}},

		// S.No 41 - EW 112 - B.E. EI - 22EI301
		{HallNo: "EW 112", CourseCode: "22EI301", RegisterNos: []string{
			"7376231EI124", "7376231EI128", "7376231EI143", "7376231EI151",
			"7376231EI153", "7376231EI156", "7376231EI159",
		}},

		// S.No 42 - EW 112 - B.E. MZ - 22MC301
		{HallNo: "EW 112", CourseCode: "22MC301", RegisterNos: []string{
			"7376241MZ501", "7376241MZ504", "7376241MZ505",
		}},

		// S.No 43 - EW 112 - B.Tech. BT - 22BT301
		{HallNo: "EW 112", CourseCode: "22BT301", RegisterNos: []string{
			"7376232BT115", "7376232BT124", "7376232BT134", "7376232BT142",
			"7376232BT148", "7376232BT176", "7376232BT191",
		}},

		// S.No 44 - EW 112 - B.E. EE - 22EE301
		{HallNo: "EW 112", CourseCode: "22EE301", RegisterNos: []string{
			"7376251EE515", "7376251EE517",
		}},

		// S.No 45 - EW 112 - B.E. MZ - 22MC301
		{HallNo: "EW 112", CourseCode: "22MC301", RegisterNos: []string{
			"7376251MZ503", "7376251MZ504", "7376251MZ505", "7376251MZ506",
		}},

		// S.No 46 - EW 201 - B.E. ME - 22ME301
		{HallNo: "EW 201", CourseCode: "22ME301", RegisterNos: []string{
			"7376221ME111", "7376221ME114", "7376221ME116", "7376221ME133",
			"7376221ME138",
		}},

		// S.No 47 - EW 201 - B.Tech. AD - 22AI301
		{HallNo: "EW 201", CourseCode: "22AI301", RegisterNos: []string{
			"7376222AD123", "7376232AD502",
		}},

		// S.No 48 - EW 201 - B.Tech. AD - 22AI301
		{HallNo: "EW 201", CourseCode: "22AI301", RegisterNos: []string{
			"7376232AD119", "7376232AD184", "7376232AD250", "7376242AD502",
			"7376242AD510",
		}},

		// S.No 49 - EW 201 - B.Tech. BT - 22BT301
		{HallNo: "EW 201", CourseCode: "22BT301", RegisterNos: []string{
			"7376242BT186", "7376242BT218", "7376242BT219", "7376242BT220",
			"7376252BT501",
		}},

		// S.No 50 - EW 201 - B.Tech. AD - 22AI301
		{HallNo: "EW 201", CourseCode: "22AI301", RegisterNos: []string{
			"7376242AD137", "7376242AD189", "7376242AD190", "7376242AD291",
			"7376242AD320", "7376242AD326", "7376252AD502", "7376252AD503",
		}},

		// S.No 51 - EW 202 - B.E. ME - 22ME301
		{HallNo: "EW 202", CourseCode: "22ME301", RegisterNos: []string{
			"7376221ME143", "7376221ME154",
		}},

		// S.No 52 - EW 202 - B.Tech. AL - 22AM301
		{HallNo: "EW 202", CourseCode: "22AM301", RegisterNos: []string{
			"7376232AL510",
		}},

		// S.No 53 - EW 202 - B.E. ME - 22ME301
		{HallNo: "EW 202", CourseCode: "22ME301", RegisterNos: []string{
			"7376231ME101", "7376231ME103", "7376231ME104", "7376231ME121",
			"7376231ME127", "7376231ME130", "7376231ME143", "7376231ME149",
		}},

		// S.No 54 - EW 202 - B.Tech. CB - 22CB301
		{HallNo: "EW 202", CourseCode: "22CB301", RegisterNos: []string{
			"7376232CB123", "7376232CB133",
		}},

		// S.No 55 - EW 202 - B.Tech. AL - 22AM301
		{HallNo: "EW 202", CourseCode: "22AM301", RegisterNos: []string{
			"7376242AL501", "7376242AL505",
		}},

		// S.No 56 - EW 202 - B.Tech. CB - 22CB301
		{HallNo: "EW 202", CourseCode: "22CB301", RegisterNos: []string{
			"7376242CB116",
		}},

		// S.No 57 - EW 202 - B.Tech. AD - 22AI301
		{HallNo: "EW 202", CourseCode: "22AI301", RegisterNos: []string{
			"7376252AD509", "7376252AD513", "7376252AD515",
		}},

		// S.No 58 - EW 202 - B.Tech. AL - 22AM301
		{HallNo: "EW 202", CourseCode: "22AM301", RegisterNos: []string{
			"7376242AL104", "7376242AL157", "7376242AL169", "7376242AL197",
			"7376242AL207", "7376252AL503",
		}},

		// S.No 59 - EW 203 - B.E. ME - 22ME301
		{HallNo: "EW 203", CourseCode: "22ME301", RegisterNos: []string{
			"7376231ME503",
		}},

		// S.No 60 - EW 203 - B.E. MC - 22MC301
		{HallNo: "EW 203", CourseCode: "22MC301", RegisterNos: []string{
			"7376221MC110", "7376221MC134", "7376231MC506", "7376231MC507",
			"7376231MC509",
		}},

		// S.No 61 - EW 203 - B.E. BM - 22BM301
		{HallNo: "EW 203", CourseCode: "22BM301", RegisterNos: []string{
			"7376221BM102", "7376221BM106",
		}},

		// S.No 62 - EW 203 - B.Tech. CT - 22CT301
		{HallNo: "EW 203", CourseCode: "22CT301", RegisterNos: []string{
			"7376222CT126", "7376232CT501",
		}},

		// S.No 63 - EW 203 - B.E. ME - 22ME301
		{HallNo: "EW 203", CourseCode: "22ME301", RegisterNos: []string{
			"7376241ME501", "7376241ME505",
		}},

		// S.No 64 - EW 203 - B.Tech. CT - 22CT301
		{HallNo: "EW 203", CourseCode: "22CT301", RegisterNos: []string{
			"7376232CT102", "7376232CT122", "7376232CT127", "7376242CT503",
		}},

		// S.No 65 - EW 203 - B.E. ME - 22ME301
		{HallNo: "EW 203", CourseCode: "22ME301", RegisterNos: []string{
			"7376241ME110", "7376241ME123", "7376241ME127", "7376251ME503",
			"7376251ME507",
		}},

		// S.No 66 - EW 203 - B.Tech. CB - 22CB301
		{HallNo: "EW 203", CourseCode: "22CB301", RegisterNos: []string{
			"7376242CB118", "7376242CB119", "7376242CB147", "7376242CB154",
		}},

		// S.No 67 - EW 206 - B.E. CE - 22CE301
		{HallNo: "EW 206", CourseCode: "22CE301", RegisterNos: []string{
			"7376221CE124", "7376231CE503",
		}},

		// S.No 68 - EW 206 - B.E. EC - 22EC301
		{HallNo: "EW 206", CourseCode: "22EC301", RegisterNos: []string{
			"7376221EC107", "7376221EC116", "7376221EC151", "7376221EC226",
			"7376231EC507", "7376231EC514",
		}},

		// S.No 69 - EW 206 - B.E. MC - 22MC301
		{HallNo: "EW 206", CourseCode: "22MC301", RegisterNos: []string{
			"7376231MC510",
		}},

		// S.No 70 - EW 206 - B.E. BM - 22BM301
		{HallNo: "EW 206", CourseCode: "22BM301", RegisterNos: []string{
			"7376221BM109", "7376221BM143", "7376231BM501", "7376231BM502",
		}},

		// S.No 71 - EW 206 - B.E. SE - 22IS301
		{HallNo: "EW 206", CourseCode: "22IS301", RegisterNos: []string{
			"7376221SE134", "7376221SE140", "7376221SE157", "7376231SE504",
		}},

		// S.No 72 - EW 206 - B.E. CD - 22CD301
		{HallNo: "EW 206", CourseCode: "22CD301", RegisterNos: []string{
			"7376221CD114", "7376221CD144", "7376221CD153",
		}},

		// S.No 73 - EW 206 - B.Tech. FD - 22FD301
		{HallNo: "EW 206", CourseCode: "22FD301", RegisterNos: []string{
			"7376222FD107", "7376222FD121", "7376222FD125",
		}},

		// S.No 74 - EW 206 - B.Tech. FT - 22FT301
		{HallNo: "EW 206", CourseCode: "22FT301", RegisterNos: []string{
			"7376222FT102", "7376232FT501",
		}},

		// S.No 75 - EW 206 - B.Tech. TT - 22TT301
		{HallNo: "EW 206", CourseCode: "22TT301", RegisterNos: []string{
			"7376222TX132", "7376232TX508", "7376232TX511", "7376232TX515",
		}},

		// S.No 76 - EW 206 - B.Tech. AG - 22AG301
		{HallNo: "EW 206", CourseCode: "22AG301", RegisterNos: []string{
			"7376222AG116",
		}},

		// S.No 77 - EW 206 - B.E. CE - 22CE301
		{HallNo: "EW 206", CourseCode: "22CE301", RegisterNos: []string{
			"7376231CE117", "7376241CE501", "7376241CE502",
		}},

		// S.No 78 - EW 206 - B.E. BM - 22BM301
		{HallNo: "EW 206", CourseCode: "22BM301", RegisterNos: []string{
			"7376231BM107", "7376231BM132", "7376231BM137", "7376231BM148",
			"7376241BM501",
		}},

		// S.No 79 - EW 206 - B.E. SE - 22IS301
		{HallNo: "EW 206", CourseCode: "22IS301", RegisterNos: []string{
			"7376231SE128", "7376231SE137", "7376231SE144", "7376231SE153",
		}},

		// S.No 80 - EW 206 - B.E. CD - 22CD301
		{HallNo: "EW 206", CourseCode: "22CD301", RegisterNos: []string{
			"7376231CD115", "7376231CD143", "7376241CD501", "7376241CD502",
		}},

		// S.No 81 - EW 206 - B.Tech. FD - 22FD301
		{HallNo: "EW 206", CourseCode: "22FD301", RegisterNos: []string{
			"7376232FD137",
		}},

		// S.No 82 - EW 206 - B.Tech. AG - 22AG301
		{HallNo: "EW 206", CourseCode: "22AG301", RegisterNos: []string{
			"7376232AG113", "7376232AG151",
		}},
	}
}

// buildSeatingData07FN returns all seating records from the 07-05-2026 FN exam
// Exam Date: 07-05-2026 | Session: FN - 09:00 AM to 12:00 PM
func buildSeatingData07FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.E. CS - 22HS008
		{HallNo: "EW 101", CourseCode: "22HS008", RegisterNos: []string{
			"7376231CS102", "7376231CS244", "7376231CS259", "7376231CS292",
		}},

		// S.No 2 - EW 101 - B.E. EC - 22HS008
		{HallNo: "EW 101", CourseCode: "22HS008", RegisterNos: []string{
			"7376231EC331", "7376231EC334",
		}},

		// S.No 3 - EW 101 - B.E. CS - 22HS008
		{HallNo: "EW 101", CourseCode: "22HS008", RegisterNos: expandRange("7376241CS102", "7376241CS112")},

		// S.No 4 - EW 101 - B.E. EC - 22HS008
		{HallNo: "EW 101", CourseCode: "22HS008", RegisterNos: expandRange("7376241EC103", "7376241EC110")},

		// S.No 5 - EW 102 - B.E. CS - 22HS008
		{HallNo: "EW 102", CourseCode: "22HS008", RegisterNos: expandRange("7376241CS113", "7376241CS127")},

		// S.No 6 - EW 102 - B.E. EC - 22HS008
		{HallNo: "EW 102", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EC112", "7376241EC113")
			r = append(r, expandRange("7376241EC115", "7376241EC122")...)
			return r
		}()},

		// S.No 7 - EW 103 - B.E. CS - 22HS008
		{HallNo: "EW 103", CourseCode: "22HS008", RegisterNos: expandRange("7376241CS174", "7376241CS188")},

		// S.No 8 - EW 103 - B.E. EC - 22HS008
		{HallNo: "EW 103", CourseCode: "22HS008", RegisterNos: expandRange("7376241EC153", "7376241EC162")},

		// S.No 9 - EW 104 - B.E. CS - 22HS008
		{HallNo: "EW 104", CourseCode: "22HS008", RegisterNos: expandRange("7376241CS266", "7376241CS280")},

		// S.No 10 - EW 104 - B.E. EC - 22HS008
		{HallNo: "EW 104", CourseCode: "22HS008", RegisterNos: expandRange("7376241EC215", "7376241EC224")},

		// S.No 11 - EW 105 - B.E. CS - 22HS008
		{HallNo: "EW 105", CourseCode: "22HS008", RegisterNos: expandRange("7376241CS281", "7376241CS295")},

		// S.No 12 - EW 105 - B.E. EC - 22HS008
		{HallNo: "EW 105", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EC225", "7376241EC230")...)
			r = append(r, expandRange("7376241EC232", "7376241EC235")...)
			return r
		}()},

		// S.No 13 - EW 106 - B.E. CS - 22HS008
		{HallNo: "EW 106", CourseCode: "22HS008", RegisterNos: expandRange("7376241CS397", "7376241CS411")},

		// S.No 14 - EW 106 - B.E. EC - 22HS008
		{HallNo: "EW 106", CourseCode: "22HS008", RegisterNos: expandRange("7376241EC311", "7376241EC320")},

		// S.No 15 - EW 107 - B.E. CS - 22HS008
		{HallNo: "EW 107", CourseCode: "22HS008", RegisterNos: expandRange("7376241CS143", "7376241CS157")},

		// S.No 16 - EW 107 - B.E. EC - 22HS008
		{HallNo: "EW 107", CourseCode: "22HS008", RegisterNos: expandRange("7376241EC133", "7376241EC142")},

		// S.No 17 - EW 108 - B.E. CS - 22HS008
		{HallNo: "EW 108", CourseCode: "22HS008", RegisterNos: expandRange("7376241CS190", "7376241CS204")},

		// S.No 18 - EW 108 - B.E. EC - 22HS008
		{HallNo: "EW 108", CourseCode: "22HS008", RegisterNos: expandRange("7376241EC163", "7376241EC172")},

		// S.No 19 - EW 109 - B.E. CS - 22HS008
		{HallNo: "EW 109", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS220", "7376241CS228")...)
			r = append(r, expandRange("7376241CS230", "7376241CS235")...)
			return r
		}()},

		// S.No 20 - EW 109 - B.E. EC - 22HS008
		{HallNo: "EW 109", CourseCode: "22HS008", RegisterNos: expandRange("7376241EC184", "7376241EC193")},

		// S.No 21 - EW 111 - B.E. CS - 22HS008
		{HallNo: "EW 111", CourseCode: "22HS008", RegisterNos: expandRange("7376241CS251", "7376241CS265")},

		// S.No 22 - EW 111 - B.E. EC - 22HS008
		{HallNo: "EW 111", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EC204", "7376241EC207")...)
			r = append(r, expandRange("7376241EC209", "7376241EC214")...)
			return r
		}()},

		// S.No 23 - EW 112 - B.E. CS - 22HS008
		{HallNo: "EW 112", CourseCode: "22HS008", RegisterNos: expandRange("7376241CS296", "7376241CS310")},

		// S.No 24 - EW 112 - B.E. EC - 22HS008
		{HallNo: "EW 112", CourseCode: "22HS008", RegisterNos: expandRange("7376241EC236", "7376241EC245")},

		// S.No 25 - EW 113 - B.Tech. IT - 22HS008
		{HallNo: "EW 113", CourseCode: "22HS008", RegisterNos: expandRange("7376242IT209", "7376242IT223")},

		// S.No 26 - EW 113 - B.Tech. AD - 22HS008
		{HallNo: "EW 113", CourseCode: "22HS008", RegisterNos: expandRange("7376242AD194", "7376242AD203")},

		// S.No 27 - EW 114 - B.Tech. IT - 22HS008
		{HallNo: "EW 114", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT294", "7376242IT303")...)
			r = append(r, expandRange("7376242IT305", "7376242IT309")...)
			return r
		}()},

		// S.No 28 - EW 114 - B.Tech. AD - 22HS008
		{HallNo: "EW 114", CourseCode: "22HS008", RegisterNos: expandRange("7376242AD254", "7376242AD263")},

		// S.No 29 - EW 115 - B.Tech. IT - 22HS008
		{HallNo: "EW 115", CourseCode: "22HS008", RegisterNos: []string{"7376242IT502"}},

		// S.No 30 - EW 115 - 22HS008
		{HallNo: "EW 115", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT345", "7376242IT351")...)
			r = append(r, expandRange("7376252IT501", "7376252IT507")...)
			return r
		}()},

		// S.No 31 - EW 115 - B.Tech. AD - 22HS008
		{HallNo: "EW 115", CourseCode: "22HS008", RegisterNos: expandRange("7376242AD299", "7376242AD308")},

		// S.No 32 - EW 116 - B.E. EE - 22HS008
		{HallNo: "EW 116", CourseCode: "22HS008", RegisterNos: expandRange("7376241EE101", "7376241EE106")},

		// S.No 33 - EW 116 - B.Tech. IT - 22HS008
		{HallNo: "EW 116", CourseCode: "22HS008", RegisterNos: expandRange("7376252IT508", "7376252IT516")},

		// S.No 34 - EW 116 - B.Tech. AD - 22HS008
		{HallNo: "EW 116", CourseCode: "22HS008", RegisterNos: expandRange("7376242AD309", "7376242AD318")},

		// S.No 35 - EW 117 - B.E. EE - 22HS008
		{HallNo: "EW 117", CourseCode: "22HS008", RegisterNos: expandRange("7376241EE123", "7376241EE137")},

		// S.No 36 - EW 117 - B.Tech. AD - 22HS008
		{HallNo: "EW 117", CourseCode: "22HS008", RegisterNos: expandRange("7376242AD329", "7376242AD338")},

		// S.No 37 - EW 118 - B.E. EE - 22HS008
		{HallNo: "EW 118", CourseCode: "22HS008", RegisterNos: expandRange("7376241EE153", "7376241EE167")},

		// S.No 38 - EW 118 - B.Tech. AD - 22HS008
		{HallNo: "EW 118", CourseCode: "22HS008", RegisterNos: expandRange("7376252AD503", "7376252AD512")},

		// S.No 39 - EW 201 - B.E. CS - 22HS008
		{HallNo: "EW 201", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241CS442")
			r = append(r, expandRange("7376241CS444", "7376241CS457")...)
			return r
		}()},

		// S.No 40 - EW 201 - B.E. EC - 22HS008
		{HallNo: "EW 201", CourseCode: "22HS008", RegisterNos: expandRange("7376241EC341", "7376241EC350")},

		// S.No 41 - EW 202 - B.E. CS - 22HS008
		{HallNo: "EW 202", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS473", "7376241CS476")...)
			r = append(r, expandRange("7376251CS501", "7376251CS511")...)
			return r
		}()},

		// S.No 42 - EW 202 - B.E. EC - 22HS008
		{HallNo: "EW 202", CourseCode: "22HS008", RegisterNos: expandRange("7376251EC509", "7376251EC518")},

		// S.No 43 - EW 203 - B.Tech. IT - 22HS008
		{HallNo: "EW 203", CourseCode: "22HS008", RegisterNos: expandRange("7376242IT224", "7376242IT238")},

		// S.No 44 - EW 203 - B.Tech. AD - 22HS008
		{HallNo: "EW 203", CourseCode: "22HS008", RegisterNos: expandRange("7376242AD204", "7376242AD213")},

		// S.No 45 - EW 204 - B.Tech. IT - 22HS008
		{HallNo: "EW 204", CourseCode: "22HS008", RegisterNos: expandRange("7376242IT269", "7376242IT278")},

		// S.No 46 - EW 204 - B.Tech. AD - 22HS008
		{HallNo: "EW 204", CourseCode: "22HS008", RegisterNos: expandRange("7376242AD234", "7376242AD243")},

		// S.No 47 - EW 205 - B.Tech. IT - 22HS008
		{HallNo: "EW 205", CourseCode: "22HS008", RegisterNos: expandRange("7376242IT310", "7376242IT319")},

		// S.No 48 - EW 205 - B.Tech. AD - 22HS008
		{HallNo: "EW 205", CourseCode: "22HS008", RegisterNos: expandRange("7376242AD264", "7376242AD273")},

		// S.No 49 - EW 206 - B.Tech. IT - 22HS008
		{HallNo: "EW 206", CourseCode: "22HS008", RegisterNos: expandRange("7376242IT320", "7376242IT344")},

		// S.No 50 - EW 206 - B.Tech. AD - 22HS008
		{HallNo: "EW 206", CourseCode: "22HS008", RegisterNos: expandRange("7376242AD274", "7376242AD298")},

		// S.No 51 - EW 207 - B.E. CS - 22HS008
		{HallNo: "EW 207", CourseCode: "22HS008", RegisterNos: expandRange("7376241CS382", "7376241CS396")},

		// S.No 52 - EW 207 - B.E. EC - 22HS008
		{HallNo: "EW 207", CourseCode: "22HS008", RegisterNos: expandRange("7376241EC301", "7376241EC310")},

		// S.No 53 - EW 208 - B.E. CS - 22HS008
		{HallNo: "EW 208", CourseCode: "22HS008", RegisterNos: expandRange("7376241CS412", "7376241CS426")},

		// S.No 54 - EW 208 - B.E. EC - 22HS008
		{HallNo: "EW 208", CourseCode: "22HS008", RegisterNos: expandRange("7376241EC321", "7376241EC330")},

		// S.No 55 - EW 209 - B.E. CS - 22HS008
		{HallNo: "EW 209", CourseCode: "22HS008", RegisterNos: expandRange("7376241CS458", "7376241CS472")},

		// S.No 56 - EW 209 - B.E. EC - 22HS008
		{HallNo: "EW 209", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EC351", "7376241EC352")
			r = append(r, expandRange("7376251EC501", "7376251EC508")...)
			return r
		}()},

		// S.No 57 - EW 212 - B.Tech. IT - 22HS008
		{HallNo: "EW 212", CourseCode: "22HS008", RegisterNos: expandRange("7376242IT169", "7376242IT193")},

		// S.No 58 - EW 212 - B.Tech. AD - 22HS008
		{HallNo: "EW 212", CourseCode: "22HS008", RegisterNos: expandRange("7376242AD159", "7376242AD183")},

		// S.No 59 - EW 213 - B.E. EE - 22HS008
		{HallNo: "EW 213", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EE168", "7376241EE171")...)
			r = append(r, expandRange("7376241EE173", "7376241EE183")...)
			return r
		}()},

		// S.No 60 - EW 213 - B.Tech. AD - 22HS008
		{HallNo: "EW 213", CourseCode: "22HS008", RegisterNos: expandRange("7376252AD513", "7376252AD516")},

		// S.No 61 - EW 213 - B.Tech. AL - 22HS008
		{HallNo: "EW 213", CourseCode: "22HS008", RegisterNos: expandRange("7376242AL101", "7376242AL106")},

		// S.No 62 - EW 214 - B.E. EE - 22HS008
		{HallNo: "EW 214", CourseCode: "22HS008", RegisterNos: expandRange("7376241EE184", "7376241EE198")},

		// S.No 63 - EW 214 - B.Tech. AL - 22HS008
		{HallNo: "EW 214", CourseCode: "22HS008", RegisterNos: expandRange("7376242AL107", "7376242AL116")},

		// S.No 64 - EW 215 - B.E. EE - 22HS008
		{HallNo: "EW 215", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EE209", "7376241EE217")...)
			r = append(r, expandRange("7376251EE501", "7376251EE506")...)
			return r
		}()},

		// S.No 65 - EW 215 - B.Tech. AL - 22HS008
		{HallNo: "EW 215", CourseCode: "22HS008", RegisterNos: expandRange("7376242AL127", "7376242AL136")},

		// S.No 66 - EW 218 - B.Tech. BT - 22HS008
		{HallNo: "EW 218", CourseCode: "22HS008", RegisterNos: []string{"7376222BT110"}},

		// S.No 67 - EW 218 - 22HS008
		{HallNo: "EW 218", CourseCode: "22HS008", RegisterNos: []string{"7376232BT142"}},

		// S.No 68 - EW 218 - B.E. EE - 22HS008
		{HallNo: "EW 218", CourseCode: "22HS008", RegisterNos: []string{"7376251EE517"}},

		// S.No 69 - EW 218 - B.Tech. BT - 22HS008
		{HallNo: "EW 218", CourseCode: "22HS008", RegisterNos: expandRange("7376242BT102", "7376242BT123")},

		// S.No 70 - EW 218 - B.Tech. AL - 22HS008
		{HallNo: "EW 218", CourseCode: "22HS008", RegisterNos: expandRange("7376242AL147", "7376242AL171")},

		// S.No 71 - WW 002 - B.Tech. IT - 22HS008
		{HallNo: "WW 002", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT148", "7376242IT153")...)
			r = append(r, expandRange("7376242IT155", "7376242IT158")...)
			return r
		}()},

		// S.No 72 - WW 002 - B.Tech. AD - 22HS008
		{HallNo: "WW 002", CourseCode: "22HS008", RegisterNos: expandRange("7376242AD139", "7376242AD148")},

		// S.No 73 - WW 003 - B.Tech. IT - 22HS008
		{HallNo: "WW 003", CourseCode: "22HS008", RegisterNos: expandRange("7376242IT159", "7376242IT168")},

		// S.No 74 - WW 003 - B.Tech. AD - 22HS008
		{HallNo: "WW 003", CourseCode: "22HS008", RegisterNos: expandRange("7376242AD149", "7376242AD158")},

		// S.No 75 - WW 005 - B.Tech. IT - 22HS008
		{HallNo: "WW 005", CourseCode: "22HS008", RegisterNos: expandRange("7376242IT194", "7376242IT208")},

		// S.No 76 - WW 005 - B.Tech. AD - 22HS008
		{HallNo: "WW 005", CourseCode: "22HS008", RegisterNos: expandRange("7376242AD184", "7376242AD193")},

		// S.No 77 - WW 006 - B.Tech. IT - 22HS008
		{HallNo: "WW 006", CourseCode: "22HS008", RegisterNos: expandRange("7376242IT239", "7376242IT253")},

		// S.No 78 - WW 006 - B.Tech. AD - 22HS008
		{HallNo: "WW 006", CourseCode: "22HS008", RegisterNos: expandRange("7376242AD214", "7376242AD223")},

		// S.No 79 - WW 007 - B.Tech. IT - 22HS008
		{HallNo: "WW 007", CourseCode: "22HS008", RegisterNos: expandRange("7376242IT254", "7376242IT268")},

		// S.No 80 - WW 007 - B.Tech. AD - 22HS008
		{HallNo: "WW 007", CourseCode: "22HS008", RegisterNos: expandRange("7376242AD224", "7376242AD233")},

		// S.No 81 - WW 008 - B.Tech. IT - 22HS008
		{HallNo: "WW 008", CourseCode: "22HS008", RegisterNos: expandRange("7376242IT279", "7376242IT293")},

		// S.No 82 - WW 008 - B.Tech. AD - 22HS008
		{HallNo: "WW 008", CourseCode: "22HS008", RegisterNos: expandRange("7376242AD244", "7376242AD253")},

		// S.No 83 - WW 011 - B.E. EE - 22HS008
		{HallNo: "WW 011", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EE107", "7376241EE111")...)
			r = append(r, expandRange("7376241EE113", "7376241EE122")...)
			return r
		}()},

		// S.No 84 - WW 011 - B.Tech. AD - 22HS008
		{HallNo: "WW 011", CourseCode: "22HS008", RegisterNos: expandRange("7376242AD319", "7376242AD328")},

		// S.No 85 - WW 012 - B.E. EE - 22HS008
		{HallNo: "WW 012", CourseCode: "22HS008", RegisterNos: expandRange("7376241EE138", "7376241EE152")},

		// S.No 86 - WW 012 - B.Tech. AD - 22HS008
		{HallNo: "WW 012", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AD339", "7376242AD346")...)
			r = append(r, "7376252AD501", "7376252AD502")
			return r
		}()},

		// S.No 87 - WW 113 - B.E. CS - 22HS008
		{HallNo: "WW 113", CourseCode: "22HS008", RegisterNos: expandRange("7376241CS128", "7376241CS142")},

		// S.No 88 - WW 113 - B.E. EC - 22HS008
		{HallNo: "WW 113", CourseCode: "22HS008", RegisterNos: expandRange("7376241EC123", "7376241EC132")},

		// S.No 89 - WW 114 - B.E. CS - 22HS008
		{HallNo: "WW 114", CourseCode: "22HS008", RegisterNos: expandRange("7376241CS159", "7376241CS173")},

		// S.No 90 - WW 114 - B.E. EC - 22HS008
		{HallNo: "WW 114", CourseCode: "22HS008", RegisterNos: expandRange("7376241EC143", "7376241EC152")},

		// S.No 91 - WW 115 - B.E. CS - 22HS008
		{HallNo: "WW 115", CourseCode: "22HS008", RegisterNos: expandRange("7376241CS205", "7376241CS219")},

		// S.No 92 - WW 115 - B.E. EC - 22HS008
		{HallNo: "WW 115", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EC173", "7376241EC174")
			r = append(r, expandRange("7376241EC176", "7376241EC183")...)
			return r
		}()},

		// S.No 93 - WW 117 - B.E. CS - 22HS008
		{HallNo: "WW 117", CourseCode: "22HS008", RegisterNos: expandRange("7376241CS236", "7376241CS250")},

		// S.No 94 - WW 117 - B.E. EC - 22HS008
		{HallNo: "WW 117", CourseCode: "22HS008", RegisterNos: expandRange("7376241EC194", "7376241EC203")},

		// S.No 95 - WW 118 - B.E. CS - 22HS008
		{HallNo: "WW 118", CourseCode: "22HS008", RegisterNos: expandRange("7376241CS311", "7376241CS325")},

		// S.No 96 - WW 118 - B.E. EC - 22HS008
		{HallNo: "WW 118", CourseCode: "22HS008", RegisterNos: expandRange("7376241EC246", "7376241EC255")},

		// S.No 97 - WW 202 - B.E. CS - 22HS008
		{HallNo: "WW 202", CourseCode: "22HS008", RegisterNos: expandRange("7376241CS326", "7376241CS350")},

		// S.No 98 - WW 202 - B.E. EC - 22HS008
		{HallNo: "WW 202", CourseCode: "22HS008", RegisterNos: expandRange("7376241EC256", "7376241EC280")},

		// S.No 99 - WW 203 - B.E. CS - 22HS008
		{HallNo: "WW 203", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS351", "7376241CS353")...)
			r = append(r, expandRange("7376241CS355", "7376241CS366")...)
			return r
		}()},

		// S.No 100 - WW 203 - B.E. EC - 22HS008
		{HallNo: "WW 203", CourseCode: "22HS008", RegisterNos: expandRange("7376241EC281", "7376241EC290")},

		// S.No 101 - WW 204 - B.E. CS - 22HS008
		{HallNo: "WW 204", CourseCode: "22HS008", RegisterNos: expandRange("7376241CS427", "7376241CS441")},

		// S.No 102 - WW 204 - B.E. EC - 22HS008
		{HallNo: "WW 204", CourseCode: "22HS008", RegisterNos: expandRange("7376241EC331", "7376241EC340")},

		// S.No 103 - WW 205 - B.Tech. IT - 22HS008
		{HallNo: "WW 205", CourseCode: "22HS008", RegisterNos: expandRange("7376242IT103", "7376242IT117")},

		// S.No 104 - WW 205 - B.Tech. AD - 22HS008
		{HallNo: "WW 205", CourseCode: "22HS008", RegisterNos: expandRange("7376242AD108", "7376242AD117")},

		// S.No 105 - WW 211 - B.E. CS - 22HS008
		{HallNo: "WW 211", CourseCode: "22HS008", RegisterNos: expandRange("7376241CS367", "7376241CS381")},

		// S.No 106 - WW 211 - B.E. EC - 22HS008
		{HallNo: "WW 211", CourseCode: "22HS008", RegisterNos: expandRange("7376241EC291", "7376241EC300")},

		// S.No 107 - WW 212 - B.E. CE - 22HS008
		{HallNo: "WW 212", CourseCode: "22HS008", RegisterNos: []string{"7376221CE124"}},

		// S.No 108 - WW 212 - B.E. CD - 22HS008
		{HallNo: "WW 212", CourseCode: "22HS008", RegisterNos: []string{"7376221CD114"}},

		// S.No 109 - WW 212 - B.Tech. FD - 22HS008
		{HallNo: "WW 212", CourseCode: "22HS008", RegisterNos: []string{"7376222FD125"}},

		// S.No 110 - WW 212 - B.Tech. TT - 22HS008
		{HallNo: "WW 212", CourseCode: "22HS008", RegisterNos: []string{"7376232TX508"}},

		// S.No 111 - WW 212 - B.E. CE - 22HS008
		{HallNo: "WW 212", CourseCode: "22HS008", RegisterNos: []string{
			"7376231CE117", "7376231CE120", "7376231CE126", "7376241CE501",
		}},

		// S.No 112 - WW 212 - B.E. BM - 22HS008
		{HallNo: "WW 212", CourseCode: "22HS008", RegisterNos: []string{
			"7376231BM107", "7376241BM501",
		}},

		// S.No 113 - WW 212 - B.E. CD - 22HS008
		{HallNo: "WW 212", CourseCode: "22HS008", RegisterNos: []string{"7376241CD501"}},

		// S.No 114 - WW 212 - B.Tech. CT - 22HS008
		{HallNo: "WW 212", CourseCode: "22HS008", RegisterNos: []string{
			"7376232CT122", "7376242CT503",
		}},

		// S.No 115 - WW 212 - B.E. EI - 22HS008
		{HallNo: "WW 212", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EI147", "7376241EI160")...)
			r = append(r, "7376251EI501", "7376251EI502")
			return r
		}()},

		// S.No 116 - WW 212 - B.Tech. AG - 22HS008
		{HallNo: "WW 212", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AG116", "7376242AG124")...)
			r = append(r, "7376252AG501", "7376252AG502")
			return r
		}()},

		// S.No 117 - WW 213 - B.Tech. AD - 22HS008
		{HallNo: "WW 213", CourseCode: "22HS008", RegisterNos: []string{"7376232AD502"}},

		// S.No 118 - WW 213 - B.Tech. IT - 22HS008
		{HallNo: "WW 213", CourseCode: "22HS008", RegisterNos: []string{"7376232IT282"}},

		// S.No 119 - WW 213 - B.E. CS - 22HS008
		{HallNo: "WW 213", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376251CS512", "7376251CS513")
			r = append(r, expandRange("7376251CS515", "7376251CS524")...)
			return r
		}()},

		// S.No 120 - WW 213 - B.E. EC - 22HS008
		{HallNo: "WW 213", CourseCode: "22HS008", RegisterNos: expandRange("7376251EC519", "7376251EC521")},

		// S.No 121 - WW 213 - B.Tech. IT - 22HS008
		{HallNo: "WW 213", CourseCode: "22HS008", RegisterNos: []string{
			"7376242IT101", "7376242IT102",
		}},

		// S.No 122 - WW 213 - B.Tech. AD - 22HS008
		{HallNo: "WW 213", CourseCode: "22HS008", RegisterNos: expandRange("7376242AD102", "7376242AD107")},

		// S.No 123 - WW 214 - B.Tech. IT - 22HS008
		{HallNo: "WW 214", CourseCode: "22HS008", RegisterNos: expandRange("7376242IT118", "7376242IT132")},

		// S.No 124 - WW 214 - B.Tech. AD - 22HS008
		{HallNo: "WW 214", CourseCode: "22HS008", RegisterNos: expandRange("7376242AD118", "7376242AD127")},

		// S.No 125 - WW 215 - B.Tech. IT - 22HS008
		{HallNo: "WW 215", CourseCode: "22HS008", RegisterNos: expandRange("7376242IT133", "7376242IT147")},

		// S.No 126 - WW 215 - B.Tech. AD - 22HS008
		{HallNo: "WW 215", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242AD128", "7376242AD129")
			r = append(r, expandRange("7376242AD131", "7376242AD138")...)
			return r
		}()},

		// S.No 127 - WW 216 - B.E. EE - 22HS008
		{HallNo: "WW 216", CourseCode: "22HS008", RegisterNos: expandRange("7376241EE199", "7376241EE208")},

		// S.No 128 - WW 216 - B.Tech. AL - 22HS008
		{HallNo: "WW 216", CourseCode: "22HS008", RegisterNos: expandRange("7376242AL117", "7376242AL126")},

		// S.No 129 - WW 217 - B.E. EE - 22HS008
		{HallNo: "WW 217", CourseCode: "22HS008", RegisterNos: expandRange("7376251EE507", "7376251EE516")},

		// S.No 130 - WW 217 - B.Tech. AL - 22HS008
		{HallNo: "WW 217", CourseCode: "22HS008", RegisterNos: expandRange("7376242AL137", "7376242AL146")},

		// S.No 131 - WW 218 - B.Tech. BT - 22HS008
		{HallNo: "WW 218", CourseCode: "22HS008", RegisterNos: expandRange("7376242BT124", "7376242BT138")},

		// S.No 132 - WW 218 - B.Tech. AL - 22HS008
		{HallNo: "WW 218", CourseCode: "22HS008", RegisterNos: expandRange("7376242AL172", "7376242AL181")},

		// S.No 133 - WW 219 - B.Tech. BT - 22HS008
		{HallNo: "WW 219", CourseCode: "22HS008", RegisterNos: expandRange("7376242BT139", "7376242BT153")},

		// S.No 134 - WW 219 - B.Tech. AL - 22HS008
		{HallNo: "WW 219", CourseCode: "22HS008", RegisterNos: expandRange("7376242AL182", "7376242AL191")},

		// S.No 135 - WW 222 - B.Tech. BT - 22HS008
		{HallNo: "WW 222", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242BT154", "7376242BT160")...)
			r = append(r, expandRange("7376242BT162", "7376242BT179")...)
			return r
		}()},

		// S.No 136 - WW 222 - B.Tech. AL - 22HS008
		{HallNo: "WW 222", CourseCode: "22HS008", RegisterNos: expandRange("7376242AL192", "7376242AL216")},

		// S.No 137 - WW 223 - B.E. MZ - 22HS008
		{HallNo: "WW 223", CourseCode: "22HS008", RegisterNos: []string{
			"7376231MZ106", "7376231MZ111",
		}},

		// S.No 138 - WW 223 - 22HS008
		{HallNo: "WW 223", CourseCode: "22HS008", RegisterNos: expandRange("7376241MZ101", "7376241MZ113")},

		// S.No 139 - WW 223 - B.Tech. BT - 22HS008
		{HallNo: "WW 223", CourseCode: "22HS008", RegisterNos: expandRange("7376242BT180", "7376242BT204")},

		// S.No 140 - WW 223 - B.Tech. AL - 22HS008
		{HallNo: "WW 223", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AL217", "7376242AL223")...)
			r = append(r, expandRange("7376252AL501", "7376252AL503")...)
			return r
		}()},

		// S.No 141 - WW 224 - B.E. ME - 22HS008
		{HallNo: "WW 224", CourseCode: "22HS008", RegisterNos: []string{"7376231ME104"}},

		// S.No 142 - WW 224 - 22HS008
		{HallNo: "WW 224", CourseCode: "22HS008", RegisterNos: expandRange("7376241ME102", "7376241ME106")},

		// S.No 143 - WW 224 - B.E. MZ - 22HS008
		{HallNo: "WW 224", CourseCode: "22HS008", RegisterNos: expandRange("7376241MZ114", "7376241MZ138")},

		// S.No 144 - WW 224 - B.Tech. BT - 22HS008
		{HallNo: "WW 224", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242BT205", "7376242BT222")...)
			r = append(r, "7376252BT501")
			return r
		}()},

		// S.No 145 - WW 225 - B.E. MZ - 22HS008
		{HallNo: "WW 225", CourseCode: "22HS008", RegisterNos: []string{"7376241MZ501"}},

		// S.No 146 - WW 225 - B.E. ME - 22HS008
		{HallNo: "WW 225", CourseCode: "22HS008", RegisterNos: expandRange("7376241ME107", "7376241ME131")},

		// S.No 147 - WW 225 - B.E. MZ - 22HS008
		{HallNo: "WW 225", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241MZ139", "7376241MZ160")...)
			r = append(r, "7376251MZ501", "7376251MZ502")
			return r
		}()},

		// S.No 148 - WW 226 - B.E. EI - 22HS008
		{HallNo: "WW 226", CourseCode: "22HS008", RegisterNos: []string{"7376231EI128"}},

		// S.No 149 - WW 226 - 22HS008
		{HallNo: "WW 226", CourseCode: "22HS008", RegisterNos: expandRange("7376241EI101", "7376241EI120")},

		// S.No 150 - WW 226 - B.E. ME - 22HS008
		{HallNo: "WW 226", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241ME132")
			r = append(r, expandRange("7376241ME134", "7376241ME157")...)
			return r
		}()},

		// S.No 151 - WW 226 - B.E. MZ - 22HS008
		{HallNo: "WW 226", CourseCode: "22HS008", RegisterNos: expandRange("7376251MZ503", "7376251MZ506")},

		// S.No 152 - WW 227 - B.E. EI - 22HS008
		{HallNo: "WW 227", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EI121", "7376241EI125")...)
			r = append(r, expandRange("7376241EI127", "7376241EI146")...)
			return r
		}()},

		// S.No 153 - WW 227 - B.E. ME - 22HS008
		{HallNo: "WW 227", CourseCode: "22HS008", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241ME158", "7376241ME159")
			r = append(r, expandRange("7376251ME501", "7376251ME508")...)
			return r
		}()},

		// S.No 154 - WW 227 - B.Tech. AG - 22HS008
		{HallNo: "WW 227", CourseCode: "22HS008", RegisterNos: expandRange("7376242AG101", "7376242AG115")},
	}
}

// buildSeatingData07AN returns all seating records from the 07-05-2026 AN exam
// Exam Date: 07-05-2026 | Session: AN - 01:30 PM to 04:30 PM
func buildSeatingData07AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.E. EC - 22EC302
		{HallNo: "EW 101", CourseCode: "22EC302", RegisterNos: []string{
			"7376221EC102", "7376221EC107", "7376221EC116", "7376221EC131",
			"7376221EC151", "7376221EC158", "7376221EC290", "7376221EC337",
		}},

		// S.No 2 - EW 101 - B.Tech. IT - 22IT302
		{HallNo: "EW 101", CourseCode: "22IT302", RegisterNos: []string{
			"7376222IT110", "7376232IT504",
		}},

		// S.No 3 - EW 101 - B.E. EC - 22EC302
		{HallNo: "EW 101", CourseCode: "22EC302", RegisterNos: []string{
			"7376231EC101", "7376231EC110", "7376231EC112", "7376231EC121",
			"7376231EC283", "7376231EC297", "7376231EC305",
		}},

		// S.No 4 - EW 101 - B.Tech. IT - 22IT302
		{HallNo: "EW 101", CourseCode: "22IT302", RegisterNos: []string{
			"7376232IT118", "7376232IT146", "7376232IT152", "7376232IT282",
		}},

		// S.No 5 - EW 101 - 22IT302
		{HallNo: "EW 101", CourseCode: "22IT302", RegisterNos: []string{
			"7376242IT108", "7376242IT141", "7376242IT146", "7376242IT168",
		}},

		// S.No 6 - EW 102 - B.E. EC - 22EC302
		{HallNo: "EW 102", CourseCode: "22EC302", RegisterNos: []string{
			"7376231EC508", "7376231EC514",
		}},

		// S.No 7 - EW 102 - 22EC302
		{HallNo: "EW 102", CourseCode: "22EC302", RegisterNos: []string{
			"7376231EC331", "7376231EC334",
		}},

		// S.No 8 - EW 102 - B.Tech. IT - 22IT302
		{HallNo: "EW 102", CourseCode: "22IT302", RegisterNos: []string{"7376242IT502"}},

		// S.No 9 - EW 102 - B.E. EC - 22EC302
		{HallNo: "EW 102", CourseCode: "22EC302", RegisterNos: []string{
			"7376241EC104", "7376241EC124", "7376241EC133", "7376241EC137",
			"7376241EC138", "7376241EC139", "7376241EC140", "7376241EC142",
			"7376241EC144", "7376241EC145", "7376241EC147",
		}},

		// S.No 10 - EW 102 - B.Tech. IT - 22IT302
		{HallNo: "EW 102", CourseCode: "22IT302", RegisterNos: []string{
			"7376242IT184", "7376242IT188", "7376242IT214", "7376242IT227",
			"7376242IT300", "7376242IT319", "7376242IT345", "7376252IT503",
			"7376252IT504",
		}},

		// S.No 11 - EW 103 - B.E. EE - 22EE302
		{HallNo: "EW 103", CourseCode: "22EE302", RegisterNos: []string{"7376231EE504"}},

		// S.No 12 - EW 103 - 22EE302
		{HallNo: "EW 103", CourseCode: "22EE302", RegisterNos: []string{"7376231EE111"}},

		// S.No 13 - EW 103 - B.E. EC - 22EC302
		{HallNo: "EW 103", CourseCode: "22EC302", RegisterNos: []string{
			"7376241EC151", "7376241EC157", "7376241EC160", "7376241EC163",
			"7376241EC167", "7376241EC170", "7376241EC171", "7376241EC177",
			"7376241EC201", "7376241EC209", "7376241EC236", "7376241EC241",
			"7376241EC243", "7376241EC246", "7376241EC256",
		}},

		// S.No 14 - EW 103 - B.E. EE - 22EE302
		{HallNo: "EW 103", CourseCode: "22EE302", RegisterNos: []string{
			"7376241EE115", "7376241EE132",
		}},

		// S.No 15 - EW 103 - B.Tech. IT - 22IT302
		{HallNo: "EW 103", CourseCode: "22IT302", RegisterNos: []string{
			"7376252IT506", "7376252IT507", "7376252IT508", "7376252IT511",
			"7376252IT512", "7376252IT513",
		}},

		// S.No 16 - EW 104 - B.E. EC - 22EC302
		{HallNo: "EW 104", CourseCode: "22EC302", RegisterNos: []string{
			"7376241EC263", "7376241EC271", "7376241EC273", "7376241EC279",
			"7376241EC282", "7376241EC284", "7376241EC287", "7376241EC293",
			"7376241EC297", "7376241EC300", "7376241EC303", "7376241EC312",
			"7376241EC319", "7376241EC320", "7376241EC321",
		}},

		// S.No 17 - EW 104 - B.E. EE - 22EE302
		{HallNo: "EW 104", CourseCode: "22EE302", RegisterNos: []string{
			"7376241EE145", "7376241EE157", "7376241EE188", "7376241EE193",
			"7376241EE211", "7376251EE502", "7376251EE503", "7376251EE504",
			"7376251EE506", "7376251EE507",
		}},

		// S.No 18 - EW 105 - B.Tech. BT - 22BT302
		{HallNo: "EW 105", CourseCode: "22BT302", RegisterNos: []string{"7376222BT110"}},

		// S.No 19 - EW 105 - B.E. EC - 22EC302
		{HallNo: "EW 105", CourseCode: "22EC302", RegisterNos: []string{
			"7376241EC508", "7376241EC511", "7376241EC512", "7376241EC513",
			"7376241EC515", "7376241EC516", "7376241EC517", "7376241EC520",
		}},

		// S.No 20 - EW 105 - B.Tech. BT - 22BT302
		{HallNo: "EW 105", CourseCode: "22BT302", RegisterNos: []string{
			"7376232BT191", "7376232BT200",
		}},

		// S.No 21 - EW 105 - B.E. EC - 22EC302
		{HallNo: "EW 105", CourseCode: "22EC302", RegisterNos: []string{
			"7376241EC322", "7376241EC328", "7376241EC333", "7376241EC334",
			"7376241EC338", "7376241EC348", "7376251EC503",
		}},

		// S.No 22 - EW 105 - B.E. EE - 22EE302
		{HallNo: "EW 105", CourseCode: "22EE302", RegisterNos: []string{
			"7376251EE510", "7376251EE514", "7376251EE516",
		}},

		// S.No 23 - EW 105 - B.Tech. BT - 22BT302
		{HallNo: "EW 105", CourseCode: "22BT302", RegisterNos: []string{
			"7376242BT151", "7376242BT156", "7376242BT160", "7376242BT182",
		}},

		// S.No 24 - EW 106 - B.E. CS - 22CS302
		{HallNo: "EW 106", CourseCode: "22CS302", RegisterNos: []string{"7376221CS118"}},

		// S.No 25 - EW 106 - B.E. ME - 22ME302
		{HallNo: "EW 106", CourseCode: "22ME302", RegisterNos: []string{
			"7376221ME138", "7376221ME154",
		}},

		// S.No 26 - EW 106 - 22ME302
		{HallNo: "EW 106", CourseCode: "22ME302", RegisterNos: []string{
			"7376231ME101", "7376231ME130", "7376231ME143",
		}},

		// S.No 27 - EW 106 - B.E. EC - 22EC302
		{HallNo: "EW 106", CourseCode: "22EC302", RegisterNos: []string{
			"7376251EC505", "7376251EC506", "7376251EC507", "7376251EC508",
			"7376251EC509", "7376251EC510", "7376251EC511", "7376251EC513",
			"7376251EC515", "7376251EC516", "7376251EC517", "7376251EC518",
			"7376251EC519", "7376251EC521",
		}},

		// S.No 28 - EW 106 - B.Tech. BT - 22BT302
		{HallNo: "EW 106", CourseCode: "22BT302", RegisterNos: []string{
			"7376242BT188", "7376242BT193", "7376242BT214", "7376242BT219",
			"7376252BT501",
		}},

		// S.No 29 - EW 201 - B.E. CS - 22CS302
		{HallNo: "EW 201", CourseCode: "22CS302", RegisterNos: []string{
			"7376221CS275", "7376221CS288", "7376231CS508",
		}},

		// S.No 30 - EW 201 - 22CS302
		{HallNo: "EW 201", CourseCode: "22CS302", RegisterNos: []string{
			"7376231CS102", "7376231CS190", "7376231CS235", "7376231CS244",
			"7376231CS259", "7376231CS292",
		}},

		// S.No 31 - EW 201 - 22CS302
		{HallNo: "EW 201", CourseCode: "22CS302", RegisterNos: []string{
			"7376241CS141", "7376241CS230", "7376241CS272", "7376241CS395",
			"7376241CS410", "7376251CS501",
		}},

		// S.No 32 - EW 201 - B.E. ME - 22ME302
		{HallNo: "EW 201", CourseCode: "22ME302", RegisterNos: []string{
			"7376241ME102", "7376241ME123", "7376241ME145", "7376241ME158",
			"7376251ME503",
		}},

		// S.No 33 - EW 201 - B.Tech. AL - 22AM302
		{HallNo: "EW 201", CourseCode: "22AM302", RegisterNos: []string{
			"7376242AL144", "7376242AL157", "7376242AL169", "7376242AL176",
			"7376242AL207",
		}},

		// S.No 34 - EW 202 - B.E. CE - 22CE302
		{HallNo: "EW 202", CourseCode: "22CE302", RegisterNos: []string{"7376221CE124"}},

		// S.No 35 - EW 202 - B.E. CD - 22CD302
		{HallNo: "EW 202", CourseCode: "22CD302", RegisterNos: []string{
			"7376221CD114", "7376221CD144", "7376221CD153",
		}},

		// S.No 36 - EW 202 - B.E. MZ - 22MC302
		{HallNo: "EW 202", CourseCode: "22MC302", RegisterNos: []string{
			"7376231MZ106", "7376231MZ135", "7376241MZ501", "7376241MZ505",
		}},

		// S.No 37 - EW 202 - B.Tech. AG - 22AG302
		{HallNo: "EW 202", CourseCode: "22AG302", RegisterNos: []string{"7376232AG151"}},

		// S.No 38 - EW 202 - B.E. CS - 22CS302
		{HallNo: "EW 202", CourseCode: "22CS302", RegisterNos: []string{
			"7376251CS510", "7376251CS512",
		}},

		// S.No 39 - EW 202 - B.E. EI - 22EI302
		{HallNo: "EW 202", CourseCode: "22EI302", RegisterNos: []string{
			"7376241EI104", "7376241EI123", "7376241EI133", "7376251EI501",
		}},

		// S.No 40 - EW 202 - B.E. MZ - 22MC302
		{HallNo: "EW 202", CourseCode: "22MC302", RegisterNos: []string{
			"7376241MZ104", "7376241MZ121", "7376241MZ122", "7376241MZ124",
			"7376241MZ127", "7376241MZ129", "7376241MZ130", "7376241MZ139",
			"7376241MZ142",
		}},

		// S.No 41 - EW 202 - B.Tech. AG - 22AG302
		{HallNo: "EW 202", CourseCode: "22AG302", RegisterNos: []string{"7376252AG502"}},

		// S.No 42 - EW 206 - B.E. MC - 22MC302
		{HallNo: "EW 206", CourseCode: "22MC302", RegisterNos: []string{
			"7376221MC151", "7376231MC506", "7376231MC507",
		}},

		// S.No 43 - EW 206 - B.E. BM - 22BM302
		{HallNo: "EW 206", CourseCode: "22BM302", RegisterNos: []string{
			"7376221BM106", "7376221BM128", "7376231BM501", "7376231BM502",
		}},

		// S.No 44 - EW 206 - B.E. SE - 22IS302
		{HallNo: "EW 206", CourseCode: "22IS302", RegisterNos: []string{
			"7376221SE134", "7376221SE140", "7376231SE504",
		}},

		// S.No 45 - EW 206 - B.Tech. AD - 22AI302
		{HallNo: "EW 206", CourseCode: "22AI302", RegisterNos: []string{"7376232AD502"}},

		// S.No 46 - EW 206 - B.E. BM - 22BM302
		{HallNo: "EW 206", CourseCode: "22BM302", RegisterNos: []string{
			"7376231BM107", "7376231BM134", "7376231BM148", "7376241BM501",
		}},

		// S.No 47 - EW 206 - B.E. SE - 22IS302
		{HallNo: "EW 206", CourseCode: "22IS302", RegisterNos: []string{"7376231SE144"}},

		// S.No 48 - EW 206 - B.Tech. CB - 22CB302
		{HallNo: "EW 206", CourseCode: "22CB302", RegisterNos: []string{"7376232CB123"}},

		// S.No 49 - EW 206 - B.Tech. CT - 22CT302
		{HallNo: "EW 206", CourseCode: "22CT302", RegisterNos: []string{
			"7376232CT122", "7376232CT127",
		}},

		// S.No 50 - EW 206 - B.Tech. AD - 22AI302
		{HallNo: "EW 206", CourseCode: "22AI302", RegisterNos: []string{"7376232AD250"}},

		// S.No 51 - EW 206 - B.E. MZ - 22MC302
		{HallNo: "EW 206", CourseCode: "22MC302", RegisterNos: []string{
			"7376251MZ504", "7376251MZ505", "7376251MZ506",
		}},

		// S.No 52 - EW 206 - B.Tech. CB - 22CB302
		{HallNo: "EW 206", CourseCode: "22CB302", RegisterNos: []string{
			"7376242CB116", "7376242CB118", "7376242CB147",
		}},

		// S.No 53 - EW 206 - B.Tech. AD - 22AI302
		{HallNo: "EW 206", CourseCode: "22AI302", RegisterNos: []string{
			"7376242AD137", "7376242AD183", "7376242AD189", "7376242AD216",
			"7376242AD218", "7376242AD301", "7376242AD320", "7376242AD326",
			"7376252AD506",
		}},
	}
}

// buildSeatingData08FN returns all seating records from the 08-05-2026 FN exam
// Exam Date: 08-05-2026 | Session: FN - 09:00 AM to 12:00 PM
func buildSeatingData08FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.E. CS - 22CS034
		{HallNo: "EW 101", CourseCode: "22CS034", RegisterNos: []string{
			"7376231CS101", "7376231CS102", "7376231CS105",
			"7376231CS108", "7376231CS109", "7376231CS110", "7376231CS111",
			"7376231CS112", "7376231CS113", "7376231CS114", "7376231CS116",
			"7376231CS118", "7376231CS119", "7376231CS123", "7376231CS124",
		}},

		// S.No 2 - EW 101 - B.E. EC - 22EC003
		{HallNo: "EW 101", CourseCode: "22EC003", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EC102", "7376231EC104")...)
			r = append(r, "7376231EC106")
			r = append(r, expandRange("7376231EC109", "7376231EC111")...)
			r = append(r, "7376231EC113", "7376231EC115", "7376231EC116")
			return r
		}()},

		// S.No 3 - EW 102 - B.E. CS - 22CS034
		{HallNo: "EW 102", CourseCode: "22CS034", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS126", "7376231CS130")
			r = append(r, expandRange("7376231CS132", "7376231CS141")...)
			r = append(r, expandRange("7376231CS143", "7376231CS145")...)
			return r
		}()},

		// S.No 4 - EW 102 - B.E. EC - 22EC003
		{HallNo: "EW 102", CourseCode: "22EC003", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC117", "7376231EC118")
			r = append(r, expandRange("7376231EC120", "7376231EC127")...)
			return r
		}()},

		// S.No 5 - EW 103 - B.E. CS - 22CS034
		{HallNo: "EW 103", CourseCode: "22CS034", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS170")
			r = append(r, expandRange("7376231CS172", "7376231CS175")...)
			r = append(r, expandRange("7376231CS178", "7376231CS182")...)
			r = append(r, "7376231CS184", "7376231CS187", "7376231CS188",
				"7376231CS190", "7376231CS191")
			return r
		}()},

		// S.No 6 - EW 103 - B.E. EC - 22EC003
		{HallNo: "EW 103", CourseCode: "22EC003", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC142")
			r = append(r, expandRange("7376231EC144", "7376231EC152")...)
			return r
		}()},

		// S.No 7 - EW 104 - B.E. CS - 22CS034
		{HallNo: "EW 104", CourseCode: "22CS034", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS254", "7376231CS259")...)
			r = append(r, expandRange("7376231CS261", "7376231CS265")...)
			r = append(r, expandRange("7376231CS267", "7376231CS270")...)
			return r
		}()},

		// S.No 8 - EW 104 - B.E. EC - 22EC003
		{HallNo: "EW 104", CourseCode: "22EC003", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EC191", "7376231EC195")...)
			r = append(r, "7376231EC198", "7376231EC199", "7376231EC202",
				"7376231EC204", "7376231EC205")
			return r
		}()},

		// S.No 9 - EW 105 - B.E. CS - 22CS034
		{HallNo: "EW 105", CourseCode: "22CS034", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS271", "7376231CS273")
			r = append(r, expandRange("7376231CS275", "7376231CS283")...)
			r = append(r, expandRange("7376231CS285", "7376231CS287")...)
			r = append(r, "7376231CS289")
			return r
		}()},

		// S.No 10 - EW 105 - B.E. EC - 22EC003
		{HallNo: "EW 105", CourseCode: "22EC003", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC206")
			r = append(r, expandRange("7376231EC208", "7376231EC216")...)
			return r
		}()},

		// S.No 11 - EW 106 - B.E. CS - 22CS034
		{HallNo: "EW 106", CourseCode: "22CS034", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS326")
			r = append(r, expandRange("7376231CS328", "7376231CS331")...)
			r = append(r, "7376231CS333", "7376231CS334")
			r = append(r, expandRange("7376231CS336", "7376231CS340")...)
			r = append(r, "7376231CS342", "7376231CS343", "7376231CS347")
			return r
		}()},

		// S.No 12 - EW 106 - B.E. EC - 22EC003
		{HallNo: "EW 106", CourseCode: "22EC003", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EC237", "7376231EC243")...)
			r = append(r, "7376231EC245", "7376231EC247", "7376231EC249")
			return r
		}()},

		// S.No 13 - EW 107 - B.E. CS - 22CS034
		{HallNo: "EW 107", CourseCode: "22CS034", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS148", "7376231CS155")...)
			r = append(r, "7376231CS157", "7376231CS158", "7376231CS160",
				"7376231CS161", "7376231CS163", "7376231CS166", "7376231CS168")
			return r
		}()},

		// S.No 14 - EW 107 - B.E. EC - 22EC003
		{HallNo: "EW 107", CourseCode: "22EC003", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC128", "7376231EC129", "7376231EC131")
			r = append(r, expandRange("7376231EC134", "7376231EC137")...)
			r = append(r, expandRange("7376231EC139", "7376231EC141")...)
			return r
		}()},

		// S.No 15 - EW 108 - B.E. CS - 22CS034
		{HallNo: "EW 108", CourseCode: "22CS034", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS192", "7376231CS194")
			r = append(r, expandRange("7376231CS197", "7376231CS202")...)
			r = append(r, expandRange("7376231CS204", "7376231CS210")...)
			return r
		}()},

		// S.No 16 - EW 108 - B.E. EC - 22EC003
		{HallNo: "EW 108", CourseCode: "22EC003", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC154", "7376231EC158")
			r = append(r, expandRange("7376231EC160", "7376231EC167")...)
			return r
		}()},

		// S.No 17 - EW 109 - B.E. CS - 22CS034
		{HallNo: "EW 109", CourseCode: "22CS034", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS211", "7376231CS213")...)
			r = append(r, expandRange("7376231CS215", "7376231CS219")...)
			r = append(r, expandRange("7376231CS221", "7376231CS224")...)
			r = append(r, "7376231CS226", "7376231CS228", "7376231CS232")
			return r
		}()},

		// S.No 18 - EW 109 - B.E. EC - 22EC003
		{HallNo: "EW 109", CourseCode: "22EC003", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EC168", "7376231EC171")...)
			r = append(r, expandRange("7376231EC173", "7376231EC178")...)
			return r
		}()},

		// S.No 19 - EW 111 - B.E. CS - 22CS034
		{HallNo: "EW 111", CourseCode: "22CS034", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS233", "7376231CS235", "7376231CS236", "7376231CS239")
			r = append(r, expandRange("7376231CS241", "7376231CS251")...)
			return r
		}()},

		// S.No 20 - EW 111 - B.E. EC - 22EC003
		{HallNo: "EW 111", CourseCode: "22EC003", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EC179", "7376231EC186")...)
			r = append(r, "7376231EC188", "7376231EC189")
			return r
		}()},

		// S.No 21 - EW 112 - B.E. CS - 22CS034
		{HallNo: "EW 112", CourseCode: "22CS034", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS291")
			r = append(r, expandRange("7376231CS293", "7376231CS306")...)
			return r
		}()},

		// S.No 22 - EW 112 - B.E. EC - 22EC003
		{HallNo: "EW 112", CourseCode: "22EC003", RegisterNos: expandRange("7376231EC217", "7376231EC226")},

		// S.No 23 - EW 113 - B.Tech. IT - 22IT039
		{HallNo: "EW 113", CourseCode: "22IT039", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232IT217", "7376232IT219")...)
			r = append(r, expandRange("7376232IT221", "7376232IT226")...)
			r = append(r, "7376232IT228")
			r = append(r, expandRange("7376232IT231", "7376232IT234")...)
			r = append(r, "7376232IT236")
			return r
		}()},

		// S.No 24 - EW 113 - B.Tech. AD - 22AI029
		{HallNo: "EW 113", CourseCode: "22AI029", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AD103", "7376232AD107")...)
			r = append(r, "7376232AD109", "7376232AD111", "7376232AD112",
				"7376232AD115", "7376232AD116")
			return r
		}()},

		// S.No 25 - EW 114 - B.Tech. BT - 22BT013
		{HallNo: "EW 114", CourseCode: "22BT013", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232BT135", "7376232BT137")
			r = append(r, "7376232BT144", "7376232BT145")
			r = append(r, expandRange("7376232BT147", "7376232BT149")...)
			r = append(r, expandRange("7376232BT152", "7376232BT155")...)
			r = append(r, "7376232BT157")
			r = append(r, expandRange("7376232BT160", "7376232BT162")...)
			return r
		}()},

		// S.No 26 - EW 114 - B.Tech. AD - 22AI029
		{HallNo: "EW 114", CourseCode: "22AI029", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD214", "7376232AD215", "7376232AD220",
				"7376232AD224", "7376232AD231", "7376232AD234")
			r = append(r, expandRange("7376232AD236", "7376232AD239")...)
			return r
		}()},

		// S.No 27 - EW 115 - B.Tech. BT - 22BT013
		{HallNo: "EW 115", CourseCode: "22BT013", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232BT197", "7376232BT199")...)
			r = append(r, expandRange("7376232BT201", "7376232BT206")...)
			r = append(r, "7376232BT208", "7376232BT209")
			r = append(r, expandRange("7376232BT212", "7376232BT214")...)
			return r
		}()},

		// S.No 28 - EW 115 - B.Tech. FD - 22FD035
		{HallNo: "EW 115", CourseCode: "22FD035", RegisterNos: []string{"7376232FD102"}},

		// S.No 29 - EW 115 - B.Tech. CT - 22CT038
		{HallNo: "EW 115", CourseCode: "22CT038", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232CT101")
			r = append(r, expandRange("7376232CT103", "7376232CT110")...)
			return r
		}()},

		// S.No 30 - EW 115 - B.Tech. AD - 22AI029
		{HallNo: "EW 115", CourseCode: "22AI029", RegisterNos: []string{"7376242AD508"}},

		// S.No 31 - EW 116 - B.Tech. FD - 22FD035
		{HallNo: "EW 116", CourseCode: "22FD035", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232FD103")
			r = append(r, expandRange("7376232FD105", "7376232FD112")...)
			r = append(r, "7376232FD114")
			r = append(r, expandRange("7376232FD116", "7376232FD120")...)
			return r
		}()},

		// S.No 32 - EW 116 - B.Tech. CT - 22CT038
		{HallNo: "EW 116", CourseCode: "22CT038", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232CT112")
			r = append(r, expandRange("7376232CT114", "7376232CT117")...)
			r = append(r, "7376232CT119", "7376232CT120")
			r = append(r, expandRange("7376232CT122", "7376232CT124")...)
			return r
		}()},

		// S.No 33 - EW 117 - B.E. SE - 22IS041
		{HallNo: "EW 117", CourseCode: "22IS041", RegisterNos: []string{
			"7376221SE131", "7376221SE134", "7376221SE140",
		}},

		// S.No 34 - EW 117 - 22IS041
		{HallNo: "EW 117", CourseCode: "22IS041", RegisterNos: []string{"7376231SE101"}},

		// S.No 35 - EW 117 - B.Tech. FD - 22FD035
		{HallNo: "EW 117", CourseCode: "22FD035", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232FD140")
			r = append(r, expandRange("7376232FD142", "7376232FD150")...)
			r = append(r, "7376232FD152")
			return r
		}()},

		// S.No 36 - EW 117 - B.Tech. CT - 22CT038
		{HallNo: "EW 117", CourseCode: "22CT038", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232CT138", "7376232CT139", "7376232CT141",
				"7376232CT143", "7376232CT144", "7376232CT146")
			r = append(r, expandRange("7376232CT148", "7376232CT151")...)
			return r
		}()},

		// S.No 37 - EW 118 - B.E. SE - 22IS041
		{HallNo: "EW 118", CourseCode: "22IS041", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231SE104")
			r = append(r, expandRange("7376231SE108", "7376231SE111")...)
			r = append(r, expandRange("7376231SE113", "7376231SE115")...)
			r = append(r, expandRange("7376231SE117", "7376231SE120")...)
			r = append(r, expandRange("7376231SE125", "7376231SE127")...)
			return r
		}()},

		// S.No 38 - EW 118 - B.Tech. CT - 22CT038
		{HallNo: "EW 118", CourseCode: "22CT038", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232CT152", "7376232CT158")...)
			r = append(r, expandRange("7376232CT160", "7376232CT162")...)
			return r
		}()},

		// S.No 39 - EW 201 - B.E. CS - 22CS034
		{HallNo: "EW 201", CourseCode: "22CS034", RegisterNos: []string{
			"7376241CS514", "7376241CS516", "7376241CS518", "7376241CS519",
		}},

		// S.No 40 - EW 201 - B.E. EC - 22EC003
		{HallNo: "EW 201", CourseCode: "22EC003", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EC261", "7376231EC264")...)
			r = append(r, "7376231EC266", "7376231EC267", "7376231EC270")
			r = append(r, expandRange("7376231EC272", "7376231EC274")...)
			return r
		}()},

		// S.No 41 - EW 201 - B.Tech. IT - 22IT039
		{HallNo: "EW 201", CourseCode: "22IT039", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232IT101", "7376232IT103", "7376232IT104",
				"7376232IT106", "7376232IT107", "7376232IT110")
			r = append(r, expandRange("7376232IT116", "7376232IT120")...)
			return r
		}()},

		// S.No 42 - EW 202 - B.E. EC - 22EC003
		{HallNo: "EW 202", CourseCode: "22EC003", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC290", "7376231EC291", "7376231EC293")
			r = append(r, expandRange("7376231EC298", "7376231EC304")...)
			return r
		}()},

		// S.No 43 - EW 202 - B.Tech. IT - 22IT039
		{HallNo: "EW 202", CourseCode: "22IT039", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232IT143", "7376232IT146")...)
			r = append(r, expandRange("7376232IT148", "7376232IT158")...)
			return r
		}()},

		// S.No 44 - EW 203 - 22IT039
		{HallNo: "EW 203", CourseCode: "22IT039", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232IT237", "7376232IT239")...)
			r = append(r, expandRange("7376232IT241", "7376232IT243")...)
			r = append(r, "7376232IT245", "7376232IT248", "7376232IT249",
				"7376232IT251")
			r = append(r, expandRange("7376232IT253", "7376232IT256")...)
			r = append(r, "7376232IT259")
			return r
		}()},

		// S.No 45 - EW 203 - B.Tech. AD - 22AI029
		{HallNo: "EW 203", CourseCode: "22AI029", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD117", "7376232AD118", "7376232AD123",
				"7376232AD124", "7376232AD126", "7376232AD127", "7376232AD140",
				"7376232AD143", "7376232AD144", "7376232AD149")
			return r
		}()},

		// S.No 46 - EW 206 - B.Tech. BT - 22BT013
		{HallNo: "EW 206", CourseCode: "22BT013", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232BT163", "7376232BT166")...)
			r = append(r, "7376232BT168", "7376232BT170")
			r = append(r, expandRange("7376232BT172", "7376232BT176")...)
			r = append(r, "7376232BT178")
			r = append(r, expandRange("7376232BT180", "7376232BT183")...)
			r = append(r, "7376232BT185")
			r = append(r, expandRange("7376232BT187", "7376232BT189")...)
			r = append(r, expandRange("7376232BT192", "7376232BT196")...)
			return r
		}()},

		// S.No 47 - EW 206 - B.Tech. AD - 22AI029
		{HallNo: "EW 206", CourseCode: "22AI029", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD240")
			r = append(r, expandRange("7376232AD242", "7376232AD247")...)
			r = append(r, expandRange("7376232AD249", "7376232AD254")...)
			r = append(r, "7376232AD256", "7376232AD257")
			r = append(r, expandRange("7376232AD259", "7376232AD262")...)
			r = append(r, "7376232AD268", "7376232AD271", "7376232AD272",
				"7376232AD276", "7376232AD282", "7376232AD285")
			return r
		}()},

		// S.No 48 - EW 207 - B.E. CS - 22CS034
		{HallNo: "EW 207", CourseCode: "22CS034", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS307", "7376231CS311")...)
			r = append(r, expandRange("7376231CS314", "7376231CS321")...)
			r = append(r, "7376231CS324", "7376231CS325")
			return r
		}()},

		// S.No 49 - EW 207 - B.E. EC - 22EC003
		{HallNo: "EW 207", CourseCode: "22EC003", RegisterNos: expandRange("7376231EC227", "7376231EC236")},

		// S.No 50 - EW 208 - B.E. CS - 22CS034
		{HallNo: "EW 208", CourseCode: "22CS034", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS348", "7376231CS351", "7376231CS353")
			r = append(r, expandRange("7376241CS501", "7376241CS503")...)
			r = append(r, expandRange("7376241CS505", "7376241CS513")...)
			return r
		}()},

		// S.No 51 - EW 208 - B.E. EC - 22EC003
		{HallNo: "EW 208", CourseCode: "22EC003", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EC250", "7376231EC253")...)
			r = append(r, expandRange("7376231EC255", "7376231EC260")...)
			return r
		}()},

		// S.No 52 - EW 209 - 22EC003
		{HallNo: "EW 209", CourseCode: "22EC003", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EC275", "7376231EC277")...)
			r = append(r, expandRange("7376231EC280", "7376231EC282")...)
			r = append(r, "7376231EC284", "7376231EC286", "7376231EC287", "7376231EC289")
			return r
		}()},

		// S.No 53 - EW 209 - B.Tech. IT - 22IT039
		{HallNo: "EW 209", CourseCode: "22IT039", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232IT121", "7376232IT123", "7376232IT126")
			r = append(r, expandRange("7376232IT128", "7376232IT131")...)
			r = append(r, "7376232IT133")
			r = append(r, expandRange("7376232IT135", "7376232IT140")...)
			r = append(r, "7376232IT142")
			return r
		}()},

		// S.No 54 - EW 212 - B.E. EC - 22EC003
		{HallNo: "EW 212", CourseCode: "22EC003", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EC311", "7376231EC313")...)
			r = append(r, "7376231EC316", "7376231EC318", "7376231EC319")
			r = append(r, expandRange("7376231EC321", "7376231EC325")...)
			r = append(r, "7376231EC328", "7376231EC329")
			r = append(r, expandRange("7376231EC331", "7376231EC334")...)
			r = append(r, expandRange("7376241EC501", "7376241EC503")...)
			r = append(r, expandRange("7376241EC505", "7376241EC507")...)
			r = append(r, "7376241EC510", "7376241EC511")
			return r
		}()},

		// S.No 55 - EW 212 - B.Tech. IT - 22IT039
		{HallNo: "EW 212", CourseCode: "22IT039", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232IT159")
			r = append(r, expandRange("7376232IT164", "7376232IT168")...)
			r = append(r, "7376232IT170", "7376232IT171")
			r = append(r, expandRange("7376232IT173", "7376232IT178")...)
			r = append(r, expandRange("7376232IT180", "7376232IT187")...)
			r = append(r, "7376232IT189", "7376232IT191", "7376232IT192")
			return r
		}()},

		// S.No 56 - EW 213 - B.E. SE - 22IS041
		{HallNo: "EW 213", CourseCode: "22IS041", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231SE130", "7376231SE132", "7376231SE133")
			r = append(r, expandRange("7376231SE135", "7376231SE138")...)
			r = append(r, expandRange("7376231SE140", "7376231SE143")...)
			r = append(r, "7376231SE145")
			r = append(r, expandRange("7376231SE147", "7376231SE149")...)
			return r
		}()},

		// S.No 57 - EW 213 - B.E. CD - 22CD022
		{HallNo: "EW 213", CourseCode: "22CD022", RegisterNos: []string{
			"7376231CD102", "7376231CD103", "7376231CD105", "7376231CD106",
			"7376231CD110", "7376231CD111", "7376231CD114",
		}},

		// S.No 58 - EW 213 - B.Tech. CT - 22CT038
		{HallNo: "EW 213", CourseCode: "22CT038", RegisterNos: expandRange("7376242CT501", "7376242CT503")},

		// S.No 59 - EW 214 - B.E. SE - 22IS041
		{HallNo: "EW 214", CourseCode: "22IS041", RegisterNos: []string{"7376231SE504"}},

		// S.No 60 - EW 214 - B.E. EE - 22EE011
		{HallNo: "EW 214", CourseCode: "22EE011", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EE102", "7376231EE105")...)
			r = append(r, expandRange("7376231EE108", "7376231EE110")...)
			r = append(r, "7376231EE112", "7376231EE113", "7376231EE115", "7376231EE119")
			return r
		}()},

		// S.No 61 - EW 214 - B.E. SE - 22IS041
		{HallNo: "EW 214", CourseCode: "22IS041", RegisterNos: []string{
			"7376231SE151", "7376231SE154", "7376231SE155",
		}},

		// S.No 62 - EW 214 - B.E. CD - 22CD022
		{HallNo: "EW 214", CourseCode: "22CD022", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CD116", "7376231CD119", "7376231CD120", "7376231CD122")
			r = append(r, expandRange("7376231CD126", "7376231CD128")...)
			r = append(r, expandRange("7376231CD131", "7376231CD133")...)
			return r
		}()},

		// S.No 63 - EW 215 - B.E. EE - 22EE011
		{HallNo: "EW 215", CourseCode: "22EE011", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EE125", "7376231EE127", "7376231EE128")
			r = append(r, expandRange("7376231EE135", "7376231EE138")...)
			r = append(r, "7376231EE141", "7376231EE144")
			r = append(r, expandRange("7376231EE146", "7376231EE151")...)
			return r
		}()},

		// S.No 64 - EW 215 - B.E. CD - 22CD022
		{HallNo: "EW 215", CourseCode: "22CD022", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CD135", "7376231CD139")...)
			r = append(r, expandRange("7376231CD142", "7376231CD145")...)
			r = append(r, "7376231CD148")
			return r
		}()},

		// S.No 65 - EW 218 - B.E. EE - 22EE011
		{HallNo: "EW 218", CourseCode: "22EE011", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EE152", "7376231EE154")...)
			r = append(r, expandRange("7376231EE157", "7376231EE161")...)
			r = append(r, expandRange("7376241EE502", "7376241EE504")...)
			return r
		}()},

		// S.No 66 - EW 218 - B.E. BM - 22BM022
		{HallNo: "EW 218", CourseCode: "22BM022", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231BM102", "7376231BM103", "7376231BM108",
				"7376231BM110", "7376231BM111", "7376231BM113")
			r = append(r, expandRange("7376231BM116", "7376231BM123")...)
			return r
		}()},

		// S.No 67 - EW 218 - B.E. CD - 22CD022
		{HallNo: "EW 218", CourseCode: "22CD022", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CD150", "7376231CD151", "7376231CD154")
			r = append(r, expandRange("7376231CD157", "7376231CD162")...)
			r = append(r, "7376241CD502", "7376241CD503")
			return r
		}()},

		// S.No 68 - EW 218 - B.E. MZ - 22MC027
		{HallNo: "EW 218", CourseCode: "22MC027", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231MZ101", "7376231MZ103", "7376231MZ107", "7376231MZ108")
			r = append(r, expandRange("7376231MZ114", "7376231MZ120")...)
			r = append(r, expandRange("7376231MZ123", "7376231MZ125")...)
			return r
		}()},

		// S.No 69 - WW 005 - B.E. EC - 22EC003
		{HallNo: "WW 005", CourseCode: "22EC003", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EC513", "7376241EC515")...)
			r = append(r, expandRange("7376241EC517", "7376241EC522")...)
			return r
		}()},

		// S.No 70 - WW 005 - B.Tech. IT - 22IT039
		{HallNo: "WW 005", CourseCode: "22IT039", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232IT194", "7376232IT198")...)
			r = append(r, "7376232IT200")
			r = append(r, expandRange("7376232IT202", "7376232IT205")...)
			r = append(r, "7376232IT207", "7376232IT210", "7376232IT213",
				"7376232IT214", "7376232IT216")
			return r
		}()},

		// S.No 71 - WW 005 - B.Tech. AD - 22AI029
		{HallNo: "WW 005", CourseCode: "22AI029", RegisterNos: []string{"7376232AD102"}},

		// S.No 72 - WW 006 - B.Tech. IT - 22IT039
		{HallNo: "WW 006", CourseCode: "22IT039", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232IT260")
			r = append(r, expandRange("7376232IT263", "7376232IT266")...)
			r = append(r, "7376232IT268", "7376232IT269")
			r = append(r, expandRange("7376232IT272", "7376232IT275")...)
			r = append(r, "7376232IT277")
			r = append(r, expandRange("7376232IT283", "7376232IT285")...)
			return r
		}()},

		// S.No 73 - WW 006 - B.Tech. AD - 22AI029
		{HallNo: "WW 006", CourseCode: "22AI029", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD155", "7376232AD158", "7376232AD160",
				"7376232AD161", "7376232AD163", "7376232AD164", "7376232AD166",
				"7376232AD167", "7376232AD169", "7376232AD173")
			return r
		}()},

		// S.No 74 - WW 007 - B.Tech. BT - 22BT013
		{HallNo: "WW 007", CourseCode: "22BT013", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232BT101", "7376232BT106")...)
			r = append(r, expandRange("7376232BT109", "7376232BT112")...)
			return r
		}()},

		// S.No 75 - WW 007 - B.Tech. IT - 22IT039
		{HallNo: "WW 007", CourseCode: "22IT039", RegisterNos: []string{
			"7376232IT286", "7376242IT501", "7376242IT504", "7376242IT505",
			"7376242IT511",
		}},

		// S.No 76 - WW 007 - B.Tech. AD - 22AI029
		{HallNo: "WW 007", CourseCode: "22AI029", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD176", "7376232AD178", "7376232AD180",
				"7376232AD181", "7376232AD183", "7376232AD186", "7376232AD189",
				"7376232AD190", "7376232AD193", "7376232AD194")
			return r
		}()},

		// S.No 77 - WW 008 - B.Tech. BT - 22BT013
		{HallNo: "WW 008", CourseCode: "22BT013", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232BT114", "7376232BT115")
			r = append(r, expandRange("7376232BT117", "7376232BT120")...)
			r = append(r, "7376232BT122")
			r = append(r, expandRange("7376232BT124", "7376232BT127")...)
			r = append(r, expandRange("7376232BT129", "7376232BT131")...)
			r = append(r, "7376232BT134")
			return r
		}()},

		// S.No 78 - WW 008 - B.Tech. AD - 22AI029
		{HallNo: "WW 008", CourseCode: "22AI029", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD195", "7376232AD197", "7376232AD198",
				"7376232AD202", "7376232AD203", "7376232AD205", "7376232AD208",
				"7376232AD210", "7376232AD211", "7376232AD213")
			return r
		}()},

		// S.No 79 - WW 011 - B.Tech. FD - 22FD035
		{HallNo: "WW 011", CourseCode: "22FD035", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232FD122", "7376232FD123", "7376232FD125")
			r = append(r, expandRange("7376232FD127", "7376232FD133")...)
			r = append(r, expandRange("7376232FD135", "7376232FD139")...)
			return r
		}()},

		// S.No 80 - WW 011 - B.Tech. CT - 22CT038
		{HallNo: "WW 011", CourseCode: "22CT038", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232CT125")
			r = append(r, expandRange("7376232CT127", "7376232CT131")...)
			r = append(r, "7376232CT133")
			r = append(r, expandRange("7376232CT135", "7376232CT137")...)
			return r
		}()},

		// S.No 81 - WW 218 - B.E. BM - 22BM022
		{HallNo: "WW 218", CourseCode: "22BM022", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231BM124", "7376231BM126")...)
			r = append(r, "7376231BM128", "7376231BM131", "7376231BM132",
				"7376231BM134")
			r = append(r, expandRange("7376231BM136", "7376231BM143")...)
			return r
		}()},

		// S.No 82 - WW 218 - B.E. MZ - 22MC027
		{HallNo: "WW 218", CourseCode: "22MC027", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231MZ127", "7376231MZ129", "7376231MZ131")
			r = append(r, expandRange("7376231MZ134", "7376231MZ136")...)
			r = append(r, "7376231MZ139", "7376231MZ140", "7376231MZ142",
				"7376231MZ143")
			return r
		}()},

		// S.No 83 - WW 219 - B.E. BM - 22BM022
		{HallNo: "WW 219", CourseCode: "22BM022", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231BM144")
			r = append(r, expandRange("7376231BM147", "7376231BM150")...)
			return r
		}()},

		// S.No 84 - WW 219 - B.E. MZ - 22MC027
		{HallNo: "WW 219", CourseCode: "22MC027", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231MZ144", "7376231MZ145", "7376231MZ147",
				"7376231MZ149", "7376231MZ150")
			r = append(r, expandRange("7376231MZ154", "7376231MZ156")...)
			r = append(r, "7376231MZ158", "7376241MZ501")
			return r
		}()},

		// S.No 85 - WW 219 - B.Tech. AG - 22AG016
		{HallNo: "WW 219", CourseCode: "22AG016", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AG104", "7376232AG109", "7376232AG112",
				"7376232AG113", "7376232AG115", "7376232AG118")
			r = append(r, expandRange("7376232AG120", "7376232AG123")...)
			return r
		}()},

		// S.No 86 - WW 222 - B.E. EI - 22EI009
		{HallNo: "WW 222", CourseCode: "22EI009", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EI101")
			r = append(r, expandRange("7376231EI109", "7376231EI111")...)
			r = append(r, "7376231EI113")
			return r
		}()},

		// S.No 87 - WW 222 - B.E. ME - 22ME020
		{HallNo: "WW 222", CourseCode: "22ME020", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231ME103", "7376231ME104", "7376231ME106",
				"7376231ME108", "7376231ME110", "7376231ME113", "7376231ME114")
			r = append(r, expandRange("7376231ME117", "7376231ME120")...)
			r = append(r, "7376231ME123", "7376231ME124", "7376231ME127")
			r = append(r, expandRange("7376231ME131", "7376231ME133")...)
			r = append(r, expandRange("7376231ME136", "7376231ME139")...)
			return r
		}()},

		// S.No 88 - WW 222 - B.E. MZ - 22MC027
		{HallNo: "WW 222", CourseCode: "22MC027", RegisterNos: expandRange("7376241MZ503", "7376241MZ506")},

		// S.No 89 - WW 222 - B.Tech. AG - 22AG016
		{HallNo: "WW 222", CourseCode: "22AG016", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AG124", "7376232AG127")...)
			r = append(r, expandRange("7376232AG131", "7376232AG134")...)
			r = append(r, "7376232AG136")
			r = append(r, expandRange("7376232AG140", "7376232AG144")...)
			r = append(r, expandRange("7376232AG148", "7376232AG150")...)
			r = append(r, "7376232AG154", "7376242AG502", "7376242AG503")
			return r
		}()},

		// S.No 90 - WW 223 - B.E. EI - 22EI009
		{HallNo: "WW 223", CourseCode: "22EI009", RegisterNos: []string{
			"7376231EI501", "7376231EI503",
		}},

		// S.No 91 - WW 223 - 22EI009
		{HallNo: "WW 223", CourseCode: "22EI009", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EI117", "7376231EI118", "7376231EI122",
				"7376231EI123", "7376231EI126", "7376231EI128", "7376231EI129",
				"7376231EI131", "7376231EI134", "7376231EI136", "7376231EI141",
				"7376231EI145")
			r = append(r, expandRange("7376231EI148", "7376231EI150")...)
			r = append(r, "7376231EI152", "7376231EI153")
			r = append(r, expandRange("7376231EI155", "7376231EI157")...)
			r = append(r, "7376241EI502")
			return r
		}()},

		// S.No 92 - WW 223 - B.E. ME - 22ME020
		{HallNo: "WW 223", CourseCode: "22ME020", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231ME141", "7376231ME147")...)
			r = append(r, "7376231ME149", "7376231ME150", "7376231ME154",
				"7376231ME159", "7376231ME160", "7376241ME501", "7376241ME502",
				"7376241ME504")
			return r
		}()},

		// S.No 93 - WW 223 - B.Tech. CB - 22CB030
		{HallNo: "WW 223", CourseCode: "22CB030", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232CB102", "7376232CB103")
			r = append(r, expandRange("7376232CB105", "7376232CB108")...)
			r = append(r, expandRange("7376232CB110", "7376232CB113")...)
			return r
		}()},

		// S.No 94 - WW 223 - 22CBH03
		{HallNo: "WW 223", CourseCode: "22CBH03", RegisterNos: []string{
			"7376232CB101", "7376232CB104",
		}},

		// S.No 95 - WW 224 - B.E. CE - 22CE015
		{HallNo: "WW 224", CourseCode: "22CE015", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CE101")
			r = append(r, expandRange("7376231CE103", "7376231CE105")...)
			return r
		}()},

		// S.No 96 - WW 224 - B.E. EC - 22ECH09
		{HallNo: "WW 224", CourseCode: "22ECH09", RegisterNos: []string{"7376231EC114"}},

		// S.No 97 - WW 224 - B.E. ME - 22ME027
		{HallNo: "WW 224", CourseCode: "22ME027", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231ME101", "7376231ME102", "7376231ME107",
				"7376231ME115", "7376231ME121", "7376231ME122", "7376231ME129",
				"7376231ME134", "7376231ME135", "7376241ME503")
			return r
		}()},

		// S.No 98 - WW 224 - B.Tech. CB - 22CB030
		{HallNo: "WW 224", CourseCode: "22CB030", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232CB115", "7376232CB121", "7376232CB124",
				"7376232CB128")
			r = append(r, expandRange("7376232CB131", "7376232CB135")...)
			r = append(r, "7376232CB137", "7376232CB141")
			r = append(r, expandRange("7376232CB144", "7376232CB148")...)
			r = append(r, "7376232CB151", "7376232CB154", "7376232CB157",
				"7376232CB160", "7376232CB161")
			return r
		}()},

		// S.No 99 - WW 224 - 22CBH03
		{HallNo: "WW 224", CourseCode: "22CBH03", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232CB119", "7376232CB126", "7376232CB127",
				"7376232CB136", "7376232CB139", "7376232CB140", "7376232CB142",
				"7376232CB149", "7376232CB150", "7376232CB152", "7376232CB153",
				"7376232CB155", "7376232CB156", "7376232CB159")
			return r
		}()},

		// S.No 100 - WW 225 - B.E. CE - 22CE015
		{HallNo: "WW 225", CourseCode: "22CE015", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CE106", "7376231CE119")...)
			r = append(r, expandRange("7376231CE121", "7376231CE124")...)
			r = append(r, expandRange("7376231CE126", "7376231CE129")...)
			r = append(r, "7376241CE501", "7376241CE502", "7376241CE504")
			return r
		}()},

		// S.No 101 - WW 225 - B.E. EC - 22ECH09
		{HallNo: "WW 225", CourseCode: "22ECH09", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC156", "7376231EC187", "7376231EC190",
				"7376231EC197", "7376231EC200", "7376231EC246", "7376231EC254",
				"7376231EC307")
			return r
		}()},

		// S.No 102 - WW 225 - B.E. ME - 22MEH38
		{HallNo: "WW 225", CourseCode: "22MEH38", RegisterNos: []string{"7376231ME105"}},

		// S.No 103 - WW 225 - B.Tech. FD - 22FDH03
		{HallNo: "WW 225", CourseCode: "22FDH03", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232FD101", "7376232FD113", "7376232FD115",
				"7376232FD124", "7376232FD126", "7376232FD134", "7376232FD141",
				"7376232FD151")
			return r
		}()},

		// S.No 104 - WW 225 - B.Tech. AG - 22AGH21
		{HallNo: "WW 225", CourseCode: "22AGH21", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AG103", "7376232AG116")
			r = append(r, "7376232AG135")
			r = append(r, expandRange("7376232AG137", "7376232AG139")...)
			r = append(r, "7376232AG145", "7376232AG146")
			return r
		}()},

		// S.No 105 - WW 226 - B.E. CS - 22CSH03
		{HallNo: "WW 226", CourseCode: "22CSH03", RegisterNos: []string{
			"7376231CS220", "7376231CS260", "7376231CS335", "7376231CS345",
		}},

		// S.No 106 - WW 226 - B.E. EE - 22AMM44
		{HallNo: "WW 226", CourseCode: "22AMM44", RegisterNos: []string{"7376231EE123"}},

		// S.No 107 - WW 226 - 22EEH15
		{HallNo: "WW 226", CourseCode: "22EEH15", RegisterNos: []string{
			"7376231EE122", "7376231EE139",
		}},

		// S.No 108 - WW 226 - B.E. ME - 22MEH38
		{HallNo: "WW 226", CourseCode: "22MEH38", RegisterNos: []string{
			"7376231ME109", "7376231ME112", "7376231ME125", "7376231ME126",
			"7376231ME157",
		}},

		// S.No 109 - WW 226 - B.E. BM - 22BMH34
		{HallNo: "WW 226", CourseCode: "22BMH34", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231BM105", "7376231BM106", "7376231BM109",
				"7376231BM112", "7376231BM114", "7376231BM115", "7376231BM129",
				"7376231BM130", "7376231BM133", "7376231BM145", "7376231BM151")
			return r
		}()},

		// S.No 110 - WW 226 - B.E. SE - 22ISH27
		{HallNo: "WW 226", CourseCode: "22ISH27", RegisterNos: []string{
			"7376231SE106", "7376231SE116", "7376231SE129",
		}},

		// S.No 111 - WW 226 - B.E. CD - 22CDH31
		{HallNo: "WW 226", CourseCode: "22CDH31", RegisterNos: []string{
			"7376231CD153", "7376231CD155",
		}},

		// S.No 112 - WW 226 - B.Tech. BT - 22BMM34
		{HallNo: "WW 226", CourseCode: "22BMM34", RegisterNos: []string{"7376232BT133"}},

		// S.No 113 - WW 226 - 22BTH30
		{HallNo: "WW 226", CourseCode: "22BTH30", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232BT113", "7376232BT121", "7376232BT123")
			r = append(r, expandRange("7376232BT138", "7376232BT140")...)
			r = append(r, "7376232BT143", "7376232BT146", "7376232BT158",
				"7376232BT167", "7376232BT169", "7376232BT171", "7376232BT184",
				"7376232BT207", "7376232BT210", "7376232BT211")
			return r
		}()},

		// S.No 114 - WW 226 - B.Tech. AD - 22AIH09
		{HallNo: "WW 226", CourseCode: "22AIH09", RegisterNos: []string{
			"7376232AD101", "7376232AD154", "7376232AD162", "7376232AD188",
			"7376232AD223",
		}},

		// S.No 115 - WW 227 - B.E. CE - 22CEH01
		{HallNo: "WW 227", CourseCode: "22CEH01", RegisterNos: []string{
			"7376231CE125", "7376241CE503",
		}},

		// S.No 116 - WW 227 - B.E. EC - 22ITM48
		{HallNo: "WW 227", CourseCode: "22ITM48", RegisterNos: []string{
			"7376231EC130", "7376231EC133", "7376231EC294", "7376231EC295",
			"7376231EC327",
		}},

		// S.No 117 - WW 227 - B.E. EI - 22EIH04
		{HallNo: "WW 227", CourseCode: "22EIH04", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EI105", "7376231EI107", "7376231EI114",
				"7376231EI127", "7376231EI137", "7376231EI140", "7376231EI142",
				"7376231EI154", "7376231EI160")
			return r
		}()},

		// S.No 118 - WW 227 - B.E. ME - 22AMM44
		{HallNo: "WW 227", CourseCode: "22AMM44", RegisterNos: []string{"7376231ME161"}},

		// S.No 119 - WW 227 - B.E. MZ - 22MCH03
		{HallNo: "WW 227", CourseCode: "22MCH03", RegisterNos: []string{
			"7376231MZ109", "7376231MZ112", "7376231MZ122",
		}},

		// S.No 120 - WW 227 - B.Tech. FT - 22FTH15
		{HallNo: "WW 227", CourseCode: "22FTH15", RegisterNos: []string{
			"7376232FT113", "7376232FT114",
		}},

		// S.No 121 - WW 227 - B.Tech. IT - 22ITH03
		{HallNo: "WW 227", CourseCode: "22ITH03", RegisterNos: []string{
			"7376232IT102", "7376232IT114", "7376232IT127", "7376232IT141",
			"7376232IT257", "7376232IT271",
		}},

		// S.No 122 - WW 227 - B.Tech. CT - 22CTH03
		{HallNo: "WW 227", CourseCode: "22CTH03", RegisterNos: []string{
			"7376232CT118", "7376232CT126", "7376232CT132", "7376232CT134",
		}},

		// S.No 123 - WW 227 - B.Tech. AD - 22AIH09
		{HallNo: "WW 227", CourseCode: "22AIH09", RegisterNos: []string{
			"7376232AD241", "7376232AD266", "7376232AD278", "7376232AD280",
		}},

		// S.No 124 - WW 227 - B.Tech. AL - 22AMH32
		{HallNo: "WW 227", CourseCode: "22AMH32", RegisterNos: []string{
			"7376232AL120", "7376232AL129", "7376232AL132", "7376232AL151",
			"7376232AL170", "7376232AL195", "7376232AL207", "7376232AL209",
		}},
	}
}

// buildSeatingData08AN returns all seating records from the 08-05-2026 AN exam
// Exam Date: 08-05-2026 | Session: AN - 01:30 PM to 04:30 PM
func buildSeatingData08AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.E. EC - 22EC503
		{HallNo: "EW 101", CourseCode: "22EC503", RegisterNos: []string{
			"7376221EC107", "7376221EC116", "7376221EC214", "7376221EC226",
			"7376221EC288", "7376221EC290", "7376221EC337",
		}},

		// S.No 2 - EW 101 - B.Tech. IT - 22IT503
		{HallNo: "EW 101", CourseCode: "22IT503", RegisterNos: []string{"7376222IT110"}},

		// S.No 3 - EW 101 - B.E. EC - 22EC503
		{HallNo: "EW 101", CourseCode: "22EC503", RegisterNos: []string{
			"7376231EC101", "7376231EC110", "7376231EC112", "7376231EC178",
			"7376231EC196", "7376231EC231", "7376231EC283", "7376231EC297",
		}},

		// S.No 4 - EW 101 - B.Tech. IT - 22IT503
		{HallNo: "EW 101", CourseCode: "22IT503", RegisterNos: []string{
			"7376232IT118", "7376232IT122", "7376232IT139", "7376232IT146",
			"7376232IT152", "7376232IT211", "7376232IT224", "7376232IT228",
			"7376232IT250",
		}},

		// S.No 5 - EW 102 - B.E. CS - 22CS503
		{HallNo: "EW 102", CourseCode: "22CS503", RegisterNos: []string{
			"7376221CS275", "7376221CS288",
		}},

		// S.No 6 - EW 102 - B.E. EC - 22EC503
		{HallNo: "EW 102", CourseCode: "22EC503", RegisterNos: []string{
			"7376231EC502", "7376231EC507", "7376231EC514",
		}},

		// S.No 7 - EW 102 - B.E. CS - 22CS503
		{HallNo: "EW 102", CourseCode: "22CS503", RegisterNos: []string{
			"7376231CS102", "7376231CS190", "7376231CS235", "7376231CS244",
			"7376231CS259",
		}},

		// S.No 8 - EW 102 - B.E. EC - 22EC503
		{HallNo: "EW 102", CourseCode: "22EC503", RegisterNos: []string{
			"7376231EC305", "7376231EC318", "7376231EC331", "7376231EC334",
			"7376241EC511", "7376241EC512", "7376241EC513", "7376241EC514",
			"7376241EC516", "7376241EC520",
		}},

		// S.No 9 - EW 102 - B.Tech. IT - 22IT503
		{HallNo: "EW 102", CourseCode: "22IT503", RegisterNos: []string{
			"7376242IT502", "7376242IT504",
		}},

		// S.No 10 - EW 102 - B.Tech. CT - 22CT503
		{HallNo: "EW 102", CourseCode: "22CT503", RegisterNos: []string{
			"7376232CT103", "7376232CT117",
		}},

		// S.No 11 - EW 102 - B.Tech. AG - 22AG503
		{HallNo: "EW 102", CourseCode: "22AG503", RegisterNos: []string{"7376232AG111"}},

		// S.No 12 - EW 103 - B.Tech. CT - 22CT503
		{HallNo: "EW 103", CourseCode: "22CT503", RegisterNos: []string{
			"7376232CT501", "7376232CT504",
		}},

		// S.No 13 - EW 103 - B.Tech. AG - 22AG503
		{HallNo: "EW 103", CourseCode: "22AG503", RegisterNos: []string{
			"7376222AG116", "7376222AG120",
		}},

		// S.No 14 - EW 103 - B.E. MZ - 22MC503
		{HallNo: "EW 103", CourseCode: "22MC503", RegisterNos: []string{
			"7376231MZ106", "7376231MZ107", "7376231MZ111", "7376231MZ135",
			"7376231MZ145", "7376231MZ150", "7376241MZ501",
		}},

		// S.No 15 - EW 103 - B.Tech. CT - 22CT503
		{HallNo: "EW 103", CourseCode: "22CT503", RegisterNos: []string{
			"7376232CT122", "7376232CT127", "7376232CT160", "7376242CT503",
		}},

		// S.No 16 - EW 103 - B.Tech. AD - 22AI503
		{HallNo: "EW 103", CourseCode: "22AI503", RegisterNos: []string{
			"7376232AD115", "7376232AD184", "7376232AD228", "7376232AD250",
			"7376232AD282",
		}},

		// S.No 17 - EW 103 - B.Tech. AG - 22AG503
		{HallNo: "EW 103", CourseCode: "22AG503", RegisterNos: []string{
			"7376232AG113", "7376232AG129", "7376232AG132", "7376232AG144",
			"7376232AG151",
		}},

		// S.No 18 - EW 104 - B.E. CE - 22CE503
		{HallNo: "EW 104", CourseCode: "22CE503", RegisterNos: []string{"7376221CE124"}},

		// S.No 19 - EW 104 - B.E. BM - 22BM503
		{HallNo: "EW 104", CourseCode: "22BM503", RegisterNos: []string{"7376221BM128"}},

		// S.No 20 - EW 104 - B.E. CD - 22CD503
		{HallNo: "EW 104", CourseCode: "22CD503", RegisterNos: []string{"7376221CD114"}},

		// S.No 21 - EW 104 - B.Tech. BT - 22BT503
		{HallNo: "EW 104", CourseCode: "22BT503", RegisterNos: []string{"7376222BT110"}},

		// S.No 22 - EW 104 - B.Tech. CB - 22CB503
		{HallNo: "EW 104", CourseCode: "22CB503", RegisterNos: []string{"7376222CB121"}},

		// S.No 23 - EW 104 - B.Tech. AD - 22AI503
		{HallNo: "EW 104", CourseCode: "22AI503", RegisterNos: []string{"7376232AD502"}},

		// S.No 24 - EW 104 - B.Tech. AG - 22AG503
		{HallNo: "EW 104", CourseCode: "22AG503", RegisterNos: []string{
			"7376222AG157", "7376222AG158", "7376232AG501", "7376232AG502",
		}},

		// S.No 25 - EW 104 - B.E. CE - 22CE503
		{HallNo: "EW 104", CourseCode: "22CE503", RegisterNos: []string{
			"7376231CE117", "7376231CE120", "7376241CE501",
		}},

		// S.No 26 - EW 104 - B.E. EE - 22EE503
		{HallNo: "EW 104", CourseCode: "22EE503", RegisterNos: []string{"7376231EE111"}},

		// S.No 27 - EW 104 - B.E. BM - 22BM503
		{HallNo: "EW 104", CourseCode: "22BM503", RegisterNos: []string{
			"7376231BM107", "7376231BM146", "7376231BM148",
		}},

		// S.No 28 - EW 104 - B.E. CD - 22CD503
		{HallNo: "EW 104", CourseCode: "22CD503", RegisterNos: []string{
			"7376231CD143", "7376241CD501", "7376241CD502",
		}},

		// S.No 29 - EW 104 - B.Tech. BT - 22BT503
		{HallNo: "EW 104", CourseCode: "22BT503", RegisterNos: []string{"7376232BT142"}},

		// S.No 30 - EW 104 - B.Tech. CB - 22CB503
		{HallNo: "EW 104", CourseCode: "22CB503", RegisterNos: []string{
			"7376232CB111", "7376232CB123", "7376232CB133", "7376242CB502",
		}},

		// S.No 31 - EW 105 - B.E. MC - 22MC503
		{HallNo: "EW 105", CourseCode: "22MC503", RegisterNos: []string{"7376231MC506"}},

		// S.No 32 - EW 105 - B.E. SE - 22IS503
		{HallNo: "EW 105", CourseCode: "22IS503", RegisterNos: []string{"7376221SE134"}},

		// S.No 33 - EW 105 - B.Tech. FD - 22FD503
		{HallNo: "EW 105", CourseCode: "22FD503", RegisterNos: []string{
			"7376222FD107", "7376222FD125",
		}},

		// S.No 34 - EW 105 - B.E. EE - 22EE503
		{HallNo: "EW 105", CourseCode: "22EE503", RegisterNos: []string{
			"7376231EE115", "7376231EE149",
		}},

		// S.No 35 - EW 105 - B.E. ME - 22ME503
		{HallNo: "EW 105", CourseCode: "22ME503", RegisterNos: []string{"7376231ME130"}},

		// S.No 36 - EW 105 - B.E. SE - 22IS503
		{HallNo: "EW 105", CourseCode: "22IS503", RegisterNos: []string{"7376231SE121"}},

		// S.No 37 - EW 105 - B.Tech. BT - 22BT503
		{HallNo: "EW 105", CourseCode: "22BT503", RegisterNos: []string{"7376232BT148"}},

		// S.No 38 - EW 105 - B.Tech. AL - 22AM503
		{HallNo: "EW 105", CourseCode: "22AM503", RegisterNos: []string{"7376232AL172"}},
	}
}

// buildSeatingData09FN returns all seating records from the 09-05-2026 FN exam
// Exam Date: 09-05-2026 | Session: FN - 09:00 AM to 12:00 PM
func buildSeatingData09FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - AE 302 - B.E. CS - 22CS401
		{HallNo: "AE 302", CourseCode: "22CS401", RegisterNos: expandRange("7376241CS134", "7376241CS148")},

		// S.No 2 - AE 302 - B.E. EC - 22EC401
		{HallNo: "AE 302", CourseCode: "22EC401", RegisterNos: expandRange("7376241EC127", "7376241EC136")},

		// S.No 3 - EW 101 - B.E. CS - 22CS401
		{HallNo: "EW 101", CourseCode: "22CS401", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS149", "7376241CS157")...)
			r = append(r, expandRange("7376241CS159", "7376241CS164")...)
			return r
		}()},

		// S.No 4 - EW 101 - B.E. EC - 22EC401
		{HallNo: "EW 101", CourseCode: "22EC401", RegisterNos: expandRange("7376241EC137", "7376241EC146")},

		// S.No 5 - EW 102 - B.E. CS - 22CS401
		{HallNo: "EW 102", CourseCode: "22CS401", RegisterNos: expandRange("7376241CS165", "7376241CS179")},

		// S.No 6 - EW 102 - B.E. EC - 22EC401
		{HallNo: "EW 102", CourseCode: "22EC401", RegisterNos: expandRange("7376241EC147", "7376241EC156")},

		// S.No 7 - EW 103 - B.E. CS - 22CS401
		{HallNo: "EW 103", CourseCode: "22CS401", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS226", "7376241CS228")...)
			r = append(r, expandRange("7376241CS230", "7376241CS241")...)
			return r
		}()},

		// S.No 8 - EW 103 - B.E. EC - 22EC401
		{HallNo: "EW 103", CourseCode: "22EC401", RegisterNos: expandRange("7376241EC188", "7376241EC197")},

		// S.No 9 - EW 104 - B.E. CS - 22CS401
		{HallNo: "EW 104", CourseCode: "22CS401", RegisterNos: expandRange("7376241CS317", "7376241CS331")},

		// S.No 10 - EW 104 - B.E. EC - 22EC401
		{HallNo: "EW 104", CourseCode: "22EC401", RegisterNos: expandRange("7376241EC250", "7376241EC259")},

		// S.No 11 - EW 105 - B.E. CS - 22CS401
		{HallNo: "EW 105", CourseCode: "22CS401", RegisterNos: expandRange("7376241CS332", "7376241CS346")},

		// S.No 12 - EW 105 - B.E. EC - 22EC401
		{HallNo: "EW 105", CourseCode: "22EC401", RegisterNos: expandRange("7376241EC260", "7376241EC269")},

		// S.No 13 - EW 106 - 22EC401
		{HallNo: "EW 106", CourseCode: "22EC401", RegisterNos: []string{
			"7376241EC511", "7376241EC513",
		}},

		// S.No 14 - EW 106 - B.E. CS - 22CS401
		{HallNo: "EW 106", CourseCode: "22CS401", RegisterNos: expandRange("7376241CS449", "7376241CS463")},

		// S.No 15 - EW 106 - B.E. EC - 22EC401
		{HallNo: "EW 106", CourseCode: "22EC401", RegisterNos: expandRange("7376241EC345", "7376241EC352")},

		// S.No 16 - EW 107 - B.E. CS - 22CS401
		{HallNo: "EW 107", CourseCode: "22CS401", RegisterNos: expandRange("7376241CS196", "7376241CS210")},

		// S.No 17 - EW 107 - B.E. EC - 22EC401
		{HallNo: "EW 107", CourseCode: "22EC401", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EC167", "7376241EC174")...)
			r = append(r, "7376241EC176", "7376241EC177")
			return r
		}()},

		// S.No 18 - EW 108 - B.E. CS - 22CS401
		{HallNo: "EW 108", CourseCode: "22CS401", RegisterNos: expandRange("7376241CS242", "7376241CS256")},

		// S.No 19 - EW 108 - B.E. EC - 22EC401
		{HallNo: "EW 108", CourseCode: "22EC401", RegisterNos: expandRange("7376241EC198", "7376241EC207")},

		// S.No 20 - EW 109 - B.E. CS - 22CS401
		{HallNo: "EW 109", CourseCode: "22CS401", RegisterNos: expandRange("7376241CS272", "7376241CS286")},

		// S.No 21 - EW 109 - B.E. EC - 22EC401
		{HallNo: "EW 109", CourseCode: "22EC401", RegisterNos: expandRange("7376241EC219", "7376241EC228")},

		// S.No 22 - EW 111 - B.E. CS - 22CS401
		{HallNo: "EW 111", CourseCode: "22CS401", RegisterNos: expandRange("7376241CS302", "7376241CS316")},

		// S.No 23 - EW 111 - B.E. EC - 22EC401
		{HallNo: "EW 111", CourseCode: "22EC401", RegisterNos: expandRange("7376241EC240", "7376241EC249")},

		// S.No 24 - EW 112 - B.E. CS - 22CS401
		{HallNo: "EW 112", CourseCode: "22CS401", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS347", "7376241CS353")...)
			r = append(r, expandRange("7376241CS355", "7376241CS362")...)
			return r
		}()},

		// S.No 25 - EW 112 - B.E. EC - 22EC401
		{HallNo: "EW 112", CourseCode: "22EC401", RegisterNos: expandRange("7376241EC270", "7376241EC279")},

		// S.No 26 - EW 113 - B.Tech. IT - 22IT401
		{HallNo: "EW 113", CourseCode: "22IT401", RegisterNos: expandRange("7376242IT247", "7376242IT256")},

		// S.No 27 - EW 113 - B.Tech. AD - 22AI401
		{HallNo: "EW 113", CourseCode: "22AI401", RegisterNos: expandRange("7376242AD271", "7376242AD285")},

		// S.No 28 - EW 114 - B.Tech. AL - 22AM401
		{HallNo: "EW 114", CourseCode: "22AM401", RegisterNos: []string{
			"7376222AL152", "7376222AL169",
		}},

		// S.No 29 - EW 114 - B.Tech. IT - 22IT401
		{HallNo: "EW 114", CourseCode: "22IT401", RegisterNos: expandRange("7376242IT308", "7376242IT317")},

		// S.No 30 - EW 114 - B.Tech. AD - 22AI401
		{HallNo: "EW 114", CourseCode: "22AI401", RegisterNos: expandRange("7376252AD504", "7376252AD516")},

		// S.No 31 - EW 115 - B.Tech. IT - 22IT401
		{HallNo: "EW 115", CourseCode: "22IT401", RegisterNos: []string{
			"7376242IT506", "7376242IT509",
		}},

		// S.No 32 - EW 115 - 22IT401
		{HallNo: "EW 115", CourseCode: "22IT401", RegisterNos: expandRange("7376252IT501", "7376252IT508")},

		// S.No 33 - EW 115 - B.Tech. AL - 22AM401
		{HallNo: "EW 115", CourseCode: "22AM401", RegisterNos: expandRange("7376242AL127", "7376242AL141")},

		// S.No 34 - EW 116 - B.E. EE - 22EE401
		{HallNo: "EW 116", CourseCode: "22EE401", RegisterNos: []string{
			"7376231EE104", "7376231EE111",
		}},

		// S.No 35 - EW 116 - B.Tech. IT - 22IT401
		{HallNo: "EW 116", CourseCode: "22IT401", RegisterNos: expandRange("7376252IT509", "7376252IT516")},

		// S.No 36 - EW 116 - B.Tech. AL - 22AM401
		{HallNo: "EW 116", CourseCode: "22AM401", RegisterNos: expandRange("7376242AL142", "7376242AL156")},

		// S.No 37 - EW 117 - B.E. EE - 22EE401
		{HallNo: "EW 117", CourseCode: "22EE401", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EE109", "7376241EE111")...)
			r = append(r, expandRange("7376241EE113", "7376241EE119")...)
			return r
		}()},

		// S.No 38 - EW 117 - B.Tech. AL - 22AM401
		{HallNo: "EW 117", CourseCode: "22AM401", RegisterNos: expandRange("7376242AL172", "7376242AL186")},

		// S.No 39 - EW 118 - B.E. EE - 22EE401
		{HallNo: "EW 118", CourseCode: "22EE401", RegisterNos: expandRange("7376241EE130", "7376241EE139")},

		// S.No 40 - EW 118 - B.Tech. AL - 22AM401
		{HallNo: "EW 118", CourseCode: "22AM401", RegisterNos: expandRange("7376242AL202", "7376242AL216")},

		// S.No 41 - EW 201 - B.Tech. IT - 22IT401
		{HallNo: "EW 201", CourseCode: "22IT401", RegisterNos: []string{
			"7376222IT110", "7376232IT507",
		}},

		// S.No 42 - EW 201 - B.Tech. AD - 22AI401
		{HallNo: "EW 201", CourseCode: "22AI401", RegisterNos: []string{
			"7376222AD111", "7376222AD174", "7376222AD198",
		}},

		// S.No 43 - EW 201 - B.Tech. IT - 22IT401
		{HallNo: "EW 201", CourseCode: "22IT401", RegisterNos: []string{
			"7376232IT113", "7376232IT118", "7376232IT146", "7376232IT152",
			"7376232IT274", "7376232IT282",
		}},

		// S.No 44 - EW 201 - B.Tech. AD - 22AI401
		{HallNo: "EW 201", CourseCode: "22AI401", RegisterNos: []string{
			"7376232AD115", "7376232AD119",
		}},

		// S.No 45 - EW 201 - B.E. CS - 22CS401
		{HallNo: "EW 201", CourseCode: "22CS401", RegisterNos: expandRange("7376251CS515", "7376251CS524")},

		// S.No 46 - EW 201 - B.E. EC - 22EC401
		{HallNo: "EW 201", CourseCode: "22EC401", RegisterNos: []string{
			"7376251EC520", "7376251EC521",
		}},

		// S.No 47 - EW 202 - B.Tech. IT - 22IT401
		{HallNo: "EW 202", CourseCode: "22IT401", RegisterNos: expandRange("7376242IT111", "7376242IT120")},

		// S.No 48 - EW 202 - B.Tech. AD - 22AI401
		{HallNo: "EW 202", CourseCode: "22AI401", RegisterNos: expandRange("7376242AD105", "7376242AD119")},

		// S.No 49 - EW 203 - B.Tech. IT - 22IT401
		{HallNo: "EW 203", CourseCode: "22IT401", RegisterNos: expandRange("7376242IT257", "7376242IT266")},

		// S.No 50 - EW 203 - B.Tech. AD - 22AI401
		{HallNo: "EW 203", CourseCode: "22AI401", RegisterNos: expandRange("7376242AD286", "7376242AD300")},

		// S.No 51 - EW 204 - B.Tech. IT - 22IT401
		{HallNo: "EW 204", CourseCode: "22IT401", RegisterNos: expandRange("7376242IT287", "7376242IT296")},

		// S.No 52 - EW 204 - B.Tech. AD - 22AI401
		{HallNo: "EW 204", CourseCode: "22AI401", RegisterNos: expandRange("7376242AD331", "7376242AD340")},

		// S.No 53 - EW 205 - B.Tech. AL - 22AM401
		{HallNo: "EW 205", CourseCode: "22AM401", RegisterNos: []string{
			"7376222AL179", "7376232AL502", "7376232AL503", "7376232AL507",
			"7376232AL509", "7376232AL510",
		}},

		// S.No 54 - EW 205 - 22AM401
		{HallNo: "EW 205", CourseCode: "22AM401", RegisterNos: []string{
			"7376232AL157", "7376232AL158", "7376232AL183",
		}},

		// S.No 55 - EW 205 - B.Tech. IT - 22IT401
		{HallNo: "EW 205", CourseCode: "22IT401", RegisterNos: expandRange("7376242IT318", "7376242IT327")},

		// S.No 56 - EW 205 - B.Tech. AL - 22AM401
		{HallNo: "EW 205", CourseCode: "22AM401", RegisterNos: []string{"7376242AL101"}},

		// S.No 57 - EW 206 - B.Tech. IT - 22IT401
		{HallNo: "EW 206", CourseCode: "22IT401", RegisterNos: []string{"7376242IT502"}},

		// S.No 58 - EW 206 - 22IT401
		{HallNo: "EW 206", CourseCode: "22IT401", RegisterNos: expandRange("7376242IT328", "7376242IT351")},

		// S.No 59 - EW 206 - B.Tech. AL - 22AM401
		{HallNo: "EW 206", CourseCode: "22AM401", RegisterNos: expandRange("7376242AL102", "7376242AL126")},

		// S.No 60 - EW 207 - B.E. CS - 22CS401
		{HallNo: "EW 207", CourseCode: "22CS401", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS433", "7376241CS442")...)
			r = append(r, expandRange("7376241CS444", "7376241CS448")...)
			return r
		}()},

		// S.No 61 - EW 207 - B.E. EC - 22EC401
		{HallNo: "EW 207", CourseCode: "22EC401", RegisterNos: expandRange("7376241EC335", "7376241EC344")},

		// S.No 62 - EW 208 - B.E. CS - 22CS401
		{HallNo: "EW 208", CourseCode: "22CS401", RegisterNos: []string{
			"7376241CS503", "7376241CS506",
		}},

		// S.No 63 - EW 208 - B.E. EC - 22EC401
		{HallNo: "EW 208", CourseCode: "22EC401", RegisterNos: []string{"7376241EC516"}},

		// S.No 64 - EW 208 - B.E. CS - 22CS401
		{HallNo: "EW 208", CourseCode: "22CS401", RegisterNos: expandRange("7376241CS464", "7376241CS476")},

		// S.No 65 - EW 208 - B.E. EC - 22EC401
		{HallNo: "EW 208", CourseCode: "22EC401", RegisterNos: expandRange("7376251EC501", "7376251EC509")},

		// S.No 66 - EW 209 - B.Tech. AD - 22AI401
		{HallNo: "EW 209", CourseCode: "22AI401", RegisterNos: []string{"7376232AD502"}},

		// S.No 67 - EW 209 - 22AI401
		{HallNo: "EW 209", CourseCode: "22AI401", RegisterNos: []string{
			"7376232AD122", "7376232AD136", "7376232AD158", "7376232AD170",
			"7376232AD174", "7376232AD184", "7376232AD250", "7376232AD258",
			"7376232AD265", "7376232AD277", "7376232AD282",
		}},

		// S.No 68 - EW 209 - B.Tech. IT - 22IT401
		{HallNo: "EW 209", CourseCode: "22IT401", RegisterNos: expandRange("7376242IT101", "7376242IT110")},

		// S.No 69 - EW 209 - B.Tech. AD - 22AI401
		{HallNo: "EW 209", CourseCode: "22AI401", RegisterNos: expandRange("7376242AD102", "7376242AD104")},

		// S.No 70 - EW 210 - B.Tech. IT - 22IT401
		{HallNo: "EW 210", CourseCode: "22IT401", RegisterNos: expandRange("7376242IT131", "7376242IT140")},

		// S.No 71 - EW 210 - B.Tech. AD - 22AI401
		{HallNo: "EW 210", CourseCode: "22AI401", RegisterNos: expandRange("7376242AD136", "7376242AD145")},

		// S.No 72 - EW 211 - B.Tech. IT - 22IT401
		{HallNo: "EW 211", CourseCode: "22IT401", RegisterNos: expandRange("7376242IT192", "7376242IT201")},

		// S.No 73 - EW 211 - B.Tech. AD - 22AI401
		{HallNo: "EW 211", CourseCode: "22AI401", RegisterNos: expandRange("7376242AD211", "7376242AD220")},

		// S.No 74 - EW 212 - B.Tech. IT - 22IT401
		{HallNo: "EW 212", CourseCode: "22IT401", RegisterNos: expandRange("7376242IT202", "7376242IT226")},

		// S.No 75 - EW 212 - B.Tech. AD - 22AI401
		{HallNo: "EW 212", CourseCode: "22AI401", RegisterNos: expandRange("7376242AD221", "7376242AD245")},

		// S.No 76 - EW 213 - B.Tech. AL - 22AM401
		{HallNo: "EW 213", CourseCode: "22AM401", RegisterNos: []string{
			"7376242AL501", "7376242AL502", "7376242AL503", "7376242AL504",
			"7376242AL505", "7376242AL506",
		}},

		// S.No 77 - EW 213 - B.E. EE - 22EE401
		{HallNo: "EW 213", CourseCode: "22EE401", RegisterNos: expandRange("7376241EE140", "7376241EE149")},

		// S.No 78 - EW 213 - B.Tech. AL - 22AM401
		{HallNo: "EW 213", CourseCode: "22AM401", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AL217", "7376242AL223")...)
			r = append(r, "7376252AL501", "7376252AL502")
			return r
		}()},

		// S.No 79 - EW 214 - B.Tech. BT - 22BT401
		{HallNo: "EW 214", CourseCode: "22BT401", RegisterNos: []string{"7376222BT110"}},

		// S.No 80 - EW 214 - 22BT401
		{HallNo: "EW 214", CourseCode: "22BT401", RegisterNos: []string{"7376232BT142"}},

		// S.No 81 - EW 214 - B.E. EE - 22EE401
		{HallNo: "EW 214", CourseCode: "22EE401", RegisterNos: expandRange("7376241EE150", "7376241EE159")},

		// S.No 82 - EW 214 - B.Tech. BT - 22BT401
		{HallNo: "EW 214", CourseCode: "22BT401", RegisterNos: expandRange("7376242BT102", "7376242BT113")},

		// S.No 83 - EW 214 - B.Tech. AL - 22AM401
		{HallNo: "EW 214", CourseCode: "22AM401", RegisterNos: []string{"7376252AL503"}},

		// S.No 84 - EW 215 - B.E. EE - 22EE401
		{HallNo: "EW 215", CourseCode: "22EE401", RegisterNos: expandRange("7376241EE160", "7376241EE169")},

		// S.No 85 - EW 215 - B.Tech. BT - 22BT401
		{HallNo: "EW 215", CourseCode: "22BT401", RegisterNos: expandRange("7376242BT114", "7376242BT128")},

		// S.No 86 - EW 216 - B.E. EE - 22EE401
		{HallNo: "EW 216", CourseCode: "22EE401", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EE170", "7376241EE171")
			r = append(r, expandRange("7376241EE173", "7376241EE180")...)
			return r
		}()},

		// S.No 87 - EW 216 - B.Tech. BT - 22BT401
		{HallNo: "EW 216", CourseCode: "22BT401", RegisterNos: expandRange("7376242BT129", "7376242BT138")},

		// S.No 88 - EW 217 - B.E. EE - 22EE401
		{HallNo: "EW 217", CourseCode: "22EE401", RegisterNos: expandRange("7376241EE181", "7376241EE190")},

		// S.No 89 - EW 217 - B.Tech. BT - 22BT401
		{HallNo: "EW 217", CourseCode: "22BT401", RegisterNos: expandRange("7376242BT139", "7376242BT148")},

		// S.No 90 - EW 218 - B.E. EE - 22EE401
		{HallNo: "EW 218", CourseCode: "22EE401", RegisterNos: expandRange("7376241EE191", "7376241EE215")},

		// S.No 91 - EW 218 - B.Tech. BT - 22BT401
		{HallNo: "EW 218", CourseCode: "22BT401", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242BT149", "7376242BT160")...)
			r = append(r, expandRange("7376242BT162", "7376242BT174")...)
			return r
		}()},

		// S.No 92 - MH 301 - B.E. CS - 22CS401
		{HallNo: "MH 301", CourseCode: "22CS401", RegisterNos: []string{
			"7376221CS109", "7376221CS111", "7376221CS114", "7376221CS118",
			"7376221CS140", "7376221CS147", "7376221CS196", "7376221CS229",
			"7376221CS240", "7376221CS275", "7376221CS288", "7376221CS322",
		}},

		// S.No 93 - MH 301 - B.E. EC - 22EC401
		{HallNo: "MH 301", CourseCode: "22EC401", RegisterNos: []string{
			"7376221EC105", "7376221EC107", "7376221EC116", "7376221EC192",
			"7376221EC337",
		}},

		// S.No 94 - MH 301 - B.E. CS - 22CS401
		{HallNo: "MH 301", CourseCode: "22CS401", RegisterNos: []string{
			"7376231CS102", "7376231CS103", "7376231CS173",
		}},

		// S.No 95 - MH 301 - B.E. EC - 22EC401
		{HallNo: "MH 301", CourseCode: "22EC401", RegisterNos: []string{
			"7376231EC110", "7376231EC112", "7376231EC121", "7376231EC196",
			"7376231EC243",
		}},

		// S.No 96 - MH 302 - B.E. CS - 22CS401
		{HallNo: "MH 302", CourseCode: "22CS401", RegisterNos: []string{
			"7376231CS508", "7376231CS512",
		}},

		// S.No 97 - MH 302 - B.E. EC - 22EC401
		{HallNo: "MH 302", CourseCode: "22EC401", RegisterNos: []string{
			"7376231EC507", "7376231EC514",
		}},

		// S.No 98 - MH 302 - B.E. CS - 22CS401
		{HallNo: "MH 302", CourseCode: "22CS401", RegisterNos: []string{
			"7376231CS190", "7376231CS206", "7376231CS207", "7376231CS235",
			"7376231CS240", "7376231CS244", "7376231CS259", "7376231CS269",
			"7376231CS292", "7376231CS295", "7376231CS346",
		}},

		// S.No 99 - MH 302 - B.E. EC - 22EC401
		{HallNo: "MH 302", CourseCode: "22EC401", RegisterNos: []string{
			"7376231EC283", "7376231EC297", "7376231EC305", "7376231EC318",
			"7376231EC331", "7376231EC334",
		}},

		// S.No 100 - MH 302 - B.E. CS - 22CS401
		{HallNo: "MH 302", CourseCode: "22CS401", RegisterNos: []string{
			"7376241CS102", "7376241CS103",
		}},

		// S.No 101 - MH 302 - B.E. EC - 22EC401
		{HallNo: "MH 302", CourseCode: "22EC401", RegisterNos: []string{
			"7376241EC103", "7376241EC104",
		}},

		// S.No 102 - MH 303 - B.E. CS - 22CS401
		{HallNo: "MH 303", CourseCode: "22CS401", RegisterNos: expandRange("7376241CS104", "7376241CS118")},

		// S.No 103 - MH 303 - B.E. EC - 22EC401
		{HallNo: "MH 303", CourseCode: "22EC401", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EC105", "7376241EC110")...)
			r = append(r, "7376241EC112", "7376241EC113", "7376241EC115", "7376241EC116")
			return r
		}()},

		// S.No 104 - MH 305 - B.E. CS - 22CS401
		{HallNo: "MH 305", CourseCode: "22CS401", RegisterNos: expandRange("7376241CS119", "7376241CS133")},

		// S.No 105 - MH 305 - B.E. EC - 22EC401
		{HallNo: "MH 305", CourseCode: "22EC401", RegisterNos: expandRange("7376241EC117", "7376241EC126")},

		// S.No 106 - WW 002 - B.Tech. IT - 22IT401
		{HallNo: "WW 002", CourseCode: "22IT401", RegisterNos: expandRange("7376242IT172", "7376242IT181")},

		// S.No 107 - WW 002 - B.Tech. AD - 22AI401
		{HallNo: "WW 002", CourseCode: "22AI401", RegisterNos: expandRange("7376242AD191", "7376242AD200")},

		// S.No 108 - WW 003 - B.Tech. IT - 22IT401
		{HallNo: "WW 003", CourseCode: "22IT401", RegisterNos: expandRange("7376242IT182", "7376242IT191")},

		// S.No 109 - WW 003 - B.Tech. AD - 22AI401
		{HallNo: "WW 003", CourseCode: "22AI401", RegisterNos: expandRange("7376242AD201", "7376242AD210")},

		// S.No 110 - WW 004 - B.Tech. IT - 22IT401
		{HallNo: "WW 004", CourseCode: "22IT401", RegisterNos: expandRange("7376242IT227", "7376242IT236")},

		// S.No 111 - WW 004 - B.Tech. AD - 22AI401
		{HallNo: "WW 004", CourseCode: "22AI401", RegisterNos: expandRange("7376242AD246", "7376242AD255")},

		// S.No 112 - WW 005 - B.Tech. IT - 22IT401
		{HallNo: "WW 005", CourseCode: "22IT401", RegisterNos: expandRange("7376242IT237", "7376242IT246")},

		// S.No 113 - WW 005 - B.Tech. AD - 22AI401
		{HallNo: "WW 005", CourseCode: "22AI401", RegisterNos: expandRange("7376242AD256", "7376242AD270")},

		// S.No 114 - WW 006 - B.Tech. IT - 22IT401
		{HallNo: "WW 006", CourseCode: "22IT401", RegisterNos: expandRange("7376242IT267", "7376242IT276")},

		// S.No 115 - WW 006 - B.Tech. AD - 22AI401
		{HallNo: "WW 006", CourseCode: "22AI401", RegisterNos: expandRange("7376242AD301", "7376242AD315")},

		// S.No 116 - WW 007 - B.Tech. IT - 22IT401
		{HallNo: "WW 007", CourseCode: "22IT401", RegisterNos: expandRange("7376242IT277", "7376242IT286")},

		// S.No 117 - WW 007 - B.Tech. AD - 22AI401
		{HallNo: "WW 007", CourseCode: "22AI401", RegisterNos: expandRange("7376242AD316", "7376242AD330")},

		// S.No 118 - WW 008 - 22AI401
		{HallNo: "WW 008", CourseCode: "22AI401", RegisterNos: []string{
			"7376242AD502", "7376242AD503", "7376242AD505", "7376242AD506",
			"7376242AD509", "7376242AD510",
		}},

		// S.No 119 - WW 008 - B.Tech. IT - 22IT401
		{HallNo: "WW 008", CourseCode: "22IT401", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT297", "7376242IT303")...)
			r = append(r, expandRange("7376242IT305", "7376242IT307")...)
			return r
		}()},

		// S.No 120 - WW 008 - B.Tech. AD - 22AI401
		{HallNo: "WW 008", CourseCode: "22AI401", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AD341", "7376242AD346")...)
			r = append(r, expandRange("7376252AD501", "7376252AD503")...)
			return r
		}()},

		// S.No 121 - WW 011 - B.E. EE - 22EE401
		{HallNo: "WW 011", CourseCode: "22EE401", RegisterNos: []string{"7376231EE504"}},

		// S.No 122 - WW 011 - 22EE401
		{HallNo: "WW 011", CourseCode: "22EE401", RegisterNos: []string{"7376231EE115"}},

		// S.No 123 - WW 011 - 22EE401
		{HallNo: "WW 011", CourseCode: "22EE401", RegisterNos: expandRange("7376241EE101", "7376241EE108")},

		// S.No 124 - WW 011 - B.Tech. AL - 22AM401
		{HallNo: "WW 011", CourseCode: "22AM401", RegisterNos: expandRange("7376242AL157", "7376242AL171")},

		// S.No 125 - WW 012 - B.E. EE - 22EE401
		{HallNo: "WW 012", CourseCode: "22EE401", RegisterNos: expandRange("7376241EE120", "7376241EE129")},

		// S.No 126 - WW 012 - B.Tech. AL - 22AM401
		{HallNo: "WW 012", CourseCode: "22AM401", RegisterNos: expandRange("7376242AL187", "7376242AL201")},

		// S.No 127 - WW 113 - B.E. CS - 22CS401
		{HallNo: "WW 113", CourseCode: "22CS401", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS180", "7376241CS188")...)
			r = append(r, expandRange("7376241CS190", "7376241CS195")...)
			return r
		}()},

		// S.No 128 - WW 113 - B.E. EC - 22EC401
		{HallNo: "WW 113", CourseCode: "22EC401", RegisterNos: expandRange("7376241EC157", "7376241EC166")},

		// S.No 129 - WW 114 - B.E. CS - 22CS401
		{HallNo: "WW 114", CourseCode: "22CS401", RegisterNos: expandRange("7376241CS211", "7376241CS225")},

		// S.No 130 - WW 114 - B.E. EC - 22EC401
		{HallNo: "WW 114", CourseCode: "22EC401", RegisterNos: expandRange("7376241EC178", "7376241EC187")},

		// S.No 131 - WW 115 - B.E. CS - 22CS401
		{HallNo: "WW 115", CourseCode: "22CS401", RegisterNos: expandRange("7376241CS257", "7376241CS271")},

		// S.No 132 - WW 115 - B.E. EC - 22EC401
		{HallNo: "WW 115", CourseCode: "22EC401", RegisterNos: expandRange("7376241EC209", "7376241EC218")},

		// S.No 133 - WW 117 - B.E. CS - 22CS401
		{HallNo: "WW 117", CourseCode: "22CS401", RegisterNos: expandRange("7376241CS287", "7376241CS301")},

		// S.No 134 - WW 117 - B.E. EC - 22EC401
		{HallNo: "WW 117", CourseCode: "22EC401", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EC229", "7376241EC230")
			r = append(r, expandRange("7376241EC232", "7376241EC239")...)
			return r
		}()},

		// S.No 135 - WW 118 - B.E. CS - 22CS401
		{HallNo: "WW 118", CourseCode: "22CS401", RegisterNos: expandRange("7376241CS363", "7376241CS377")},

		// S.No 136 - WW 118 - B.E. EC - 22EC401
		{HallNo: "WW 118", CourseCode: "22EC401", RegisterNos: expandRange("7376241EC280", "7376241EC289")},

		// S.No 137 - WW 202 - B.E. CS - 22CS401
		{HallNo: "WW 202", CourseCode: "22CS401", RegisterNos: expandRange("7376241CS378", "7376241CS402")},

		// S.No 138 - WW 202 - B.E. EC - 22EC401
		{HallNo: "WW 202", CourseCode: "22EC401", RegisterNos: expandRange("7376241EC290", "7376241EC314")},

		// S.No 139 - WW 203 - B.E. CS - 22CS401
		{HallNo: "WW 203", CourseCode: "22CS401", RegisterNos: expandRange("7376241CS403", "7376241CS417")},

		// S.No 140 - WW 203 - B.E. EC - 22EC401
		{HallNo: "WW 203", CourseCode: "22EC401", RegisterNos: expandRange("7376241EC315", "7376241EC324")},

		// S.No 141 - WW 204 - B.E. CS - 22CS401
		{HallNo: "WW 204", CourseCode: "22CS401", RegisterNos: []string{
			"7376241CS507", "7376241CS517",
		}},

		// S.No 142 - WW 204 - 22CS401
		{HallNo: "WW 204", CourseCode: "22CS401", RegisterNos: expandRange("7376251CS501", "7376251CS513")},

		// S.No 143 - WW 204 - B.E. EC - 22EC401
		{HallNo: "WW 204", CourseCode: "22EC401", RegisterNos: expandRange("7376251EC510", "7376251EC519")},

		// S.No 144 - WW 205 - B.Tech. IT - 22IT401
		{HallNo: "WW 205", CourseCode: "22IT401", RegisterNos: expandRange("7376242IT141", "7376242IT150")},

		// S.No 145 - WW 205 - B.Tech. AD - 22AI401
		{HallNo: "WW 205", CourseCode: "22AI401", RegisterNos: expandRange("7376242AD146", "7376242AD160")},

		// S.No 146 - WW 211 - B.E. CS - 22CS401
		{HallNo: "WW 211", CourseCode: "22CS401", RegisterNos: expandRange("7376241CS418", "7376241CS432")},

		// S.No 147 - WW 211 - B.E. EC - 22EC401
		{HallNo: "WW 211", CourseCode: "22EC401", RegisterNos: expandRange("7376241EC325", "7376241EC334")},

		// S.No 148 - WW 212 - B.E. CE - 22CE401
		{HallNo: "WW 212", CourseCode: "22CE401", RegisterNos: []string{"7376221CE124"}},

		// S.No 149 - WW 212 - B.E. MC - 22MC401
		{HallNo: "WW 212", CourseCode: "22MC401", RegisterNos: []string{
			"7376221MC110", "7376231MC506", "7376231MC507", "7376231MC509",
			"7376231MC510",
		}},

		// S.No 150 - WW 212 - B.E. BM - 22BM401
		{HallNo: "WW 212", CourseCode: "22BM401", RegisterNos: []string{
			"7376221BM128", "7376231BM501", "7376231BM502",
		}},

		// S.No 151 - WW 212 - B.E. CD - 22CD401
		{HallNo: "WW 212", CourseCode: "22CD401", RegisterNos: []string{
			"7376221CD114", "7376221CD144", "7376221CD153", "7376231CD503",
		}},

		// S.No 152 - WW 212 - B.Tech. FD - 22FD401
		{HallNo: "WW 212", CourseCode: "22FD401", RegisterNos: []string{
			"7376222FD107", "7376222FD125",
		}},

		// S.No 153 - WW 212 - B.Tech. TT - 22TT401
		{HallNo: "WW 212", CourseCode: "22TT401", RegisterNos: []string{
			"7376222TX134", "7376232TX504", "7376232TX508", "7376232TX515",
		}},

		// S.No 154 - WW 212 - B.Tech. CT - 22CT401
		{HallNo: "WW 212", CourseCode: "22CT401", RegisterNos: []string{
			"7376222CT126", "7376232CT501", "7376232CT502", "7376232CT504",
		}},

		// S.No 155 - WW 212 - B.E. CE - 22CE401
		{HallNo: "WW 212", CourseCode: "22CE401", RegisterNos: []string{
			"7376231CE117", "7376231CE120", "7376241CE501",
		}},

		// S.No 156 - WW 212 - B.E. BM - 22BM401
		{HallNo: "WW 212", CourseCode: "22BM401", RegisterNos: []string{
			"7376231BM107", "7376231BM132", "7376231BM134", "7376231BM137",
			"7376231BM148", "7376241BM501",
		}},

		// S.No 157 - WW 212 - B.E. CD - 22CD401
		{HallNo: "WW 212", CourseCode: "22CD401", RegisterNos: []string{
			"7376231CD111", "7376231CD115", "7376231CD143", "7376241CD501",
			"7376241CD502",
		}},

		// S.No 158 - WW 212 - B.Tech. CT - 22CT401
		{HallNo: "WW 212", CourseCode: "22CT401", RegisterNos: []string{
			"7376232CT102", "7376232CT117", "7376232CT122", "7376232CT127",
			"7376242CT503",
		}},

		// S.No 159 - WW 212 - B.Tech. AG - 22AG401
		{HallNo: "WW 212", CourseCode: "22AG401", RegisterNos: []string{
			"7376242AG124", "7376252AG501", "7376252AG502",
		}},

		// S.No 160 - WW 213 - B.Tech. IT - 22IT401
		{HallNo: "WW 213", CourseCode: "22IT401", RegisterNos: expandRange("7376242IT121", "7376242IT130")},

		// S.No 161 - WW 213 - B.Tech. AD - 22AI401
		{HallNo: "WW 213", CourseCode: "22AI401", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AD120", "7376242AD129")...)
			r = append(r, expandRange("7376242AD131", "7376242AD135")...)
			return r
		}()},

		// S.No 162 - WW 214 - B.Tech. IT - 22IT401
		{HallNo: "WW 214", CourseCode: "22IT401", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT151", "7376242IT153")...)
			r = append(r, expandRange("7376242IT155", "7376242IT161")...)
			return r
		}()},

		// S.No 163 - WW 214 - B.Tech. AD - 22AI401
		{HallNo: "WW 214", CourseCode: "22AI401", RegisterNos: expandRange("7376242AD161", "7376242AD175")},

		// S.No 164 - WW 215 - B.Tech. IT - 22IT401
		{HallNo: "WW 215", CourseCode: "22IT401", RegisterNos: expandRange("7376242IT162", "7376242IT171")},

		// S.No 165 - WW 215 - B.Tech. AD - 22AI401
		{HallNo: "WW 215", CourseCode: "22AI401", RegisterNos: expandRange("7376242AD176", "7376242AD190")},

		// S.No 166 - WW 218 - B.E. EE - 22EE401
		{HallNo: "WW 218", CourseCode: "22EE401", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EE216", "7376241EE217")
			r = append(r, expandRange("7376251EE501", "7376251EE508")...)
			return r
		}()},

		// S.No 167 - WW 218 - B.Tech. BT - 22BT401
		{HallNo: "WW 218", CourseCode: "22BT401", RegisterNos: expandRange("7376242BT175", "7376242BT189")},

		// S.No 168 - WW 219 - B.E. MZ - 22MC401
		{HallNo: "WW 219", CourseCode: "22MC401", RegisterNos: []string{"7376231MZ106"}},

		// S.No 169 - WW 219 - B.E. EE - 22EE401
		{HallNo: "WW 219", CourseCode: "22EE401", RegisterNos: expandRange("7376251EE509", "7376251EE517")},

		// S.No 170 - WW 219 - B.Tech. BT - 22BT401
		{HallNo: "WW 219", CourseCode: "22BT401", RegisterNos: expandRange("7376242BT190", "7376242BT204")},

		// S.No 171 - WW 220 - B.E. MZ - 22MC401
		{HallNo: "WW 220", CourseCode: "22MC401", RegisterNos: []string{
			"7376231MZ107", "7376231MZ111", "7376231MZ113", "7376231MZ114",
			"7376231MZ115", "7376231MZ119", "7376231MZ132", "7376231MZ143",
			"7376231MZ145", "7376231MZ148",
		}},

		// S.No 172 - WW 220 - B.Tech. BT - 22BT401
		{HallNo: "WW 220", CourseCode: "22BT401", RegisterNos: expandRange("7376242BT205", "7376242BT214")},

		// S.No 173 - WW 221 - B.E. EI - 22EI401
		{HallNo: "WW 221", CourseCode: "22EI401", RegisterNos: []string{"7376221EI142"}},

		// S.No 174 - WW 221 - B.E. MZ - 22MC401
		{HallNo: "WW 221", CourseCode: "22MC401", RegisterNos: []string{
			"7376231MZ154", "7376231MZ158",
		}},

		// S.No 175 - WW 221 - 22MC401
		{HallNo: "WW 221", CourseCode: "22MC401", RegisterNos: expandRange("7376241MZ101", "7376241MZ108")},

		// S.No 176 - WW 221 - B.Tech. BT - 22BT401
		{HallNo: "WW 221", CourseCode: "22BT401", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242BT215", "7376242BT222")...)
			r = append(r, "7376252BT501")
			return r
		}()},

		// S.No 177 - WW 222 - B.E. EI - 22EI401
		{HallNo: "WW 222", CourseCode: "22EI401", RegisterNos: []string{
			"7376221EI149", "7376221EI150", "7376231EI501", "7376231EI503",
		}},

		// S.No 178 - WW 222 - B.E. EI - 22EI401
		{HallNo: "WW 222", CourseCode: "22EI401", RegisterNos: []string{
			"7376231EI117", "7376231EI124", "7376231EI128", "7376231EI132",
			"7376231EI143", "7376231EI144", "7376231EI151", "7376231EI156",
			"7376231EI159",
		}},

		// S.No 179 - WW 222 - 22EI401
		{HallNo: "WW 222", CourseCode: "22EI401", RegisterNos: expandRange("7376241EI101", "7376241EI112")},

		// S.No 180 - WW 222 - B.E. MZ - 22MC401
		{HallNo: "WW 222", CourseCode: "22MC401", RegisterNos: expandRange("7376241MZ109", "7376241MZ133")},

		// S.No 181 - WW 223 - B.E. EI - 22EI401
		{HallNo: "WW 223", CourseCode: "22EI401", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EI113", "7376241EI125")...)
			r = append(r, expandRange("7376241EI127", "7376241EI138")...)
			return r
		}()},

		// S.No 182 - WW 223 - B.E. MZ - 22MC401
		{HallNo: "WW 223", CourseCode: "22MC401", RegisterNos: expandRange("7376241MZ134", "7376241MZ158")},

		// S.No 183 - WW 224 - B.E. EI - 22EI401
		{HallNo: "WW 224", CourseCode: "22EI401", RegisterNos: []string{
			"7376241EI501", "7376241EI503",
		}},

		// S.No 184 - WW 224 - B.E. ME - 22ME401
		{HallNo: "WW 224", CourseCode: "22ME401", RegisterNos: []string{"7376231ME143"}},

		// S.No 185 - WW 224 - B.E. MZ - 22MC401
		{HallNo: "WW 224", CourseCode: "22MC401", RegisterNos: []string{
			"7376241MZ501", "7376241MZ504",
		}},

		// S.No 186 - WW 224 - B.E. EI - 22EI401
		{HallNo: "WW 224", CourseCode: "22EI401", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EI139", "7376241EI160")...)
			r = append(r, "7376251EI501")
			return r
		}()},

		// S.No 187 - WW 224 - B.E. ME - 22ME401
		{HallNo: "WW 224", CourseCode: "22ME401", RegisterNos: expandRange("7376241ME102", "7376241ME115")},

		// S.No 188 - WW 224 - B.E. MZ - 22MC401
		{HallNo: "WW 224", CourseCode: "22MC401", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241MZ159", "7376241MZ160")
			r = append(r, expandRange("7376251MZ501", "7376251MZ506")...)
			return r
		}()},

		// S.No 189 - WW 225 - B.Tech. CB - 22CB401
		{HallNo: "WW 225", CourseCode: "22CB401", RegisterNos: []string{
			"7376232CB111", "7376232CB123", "7376232CB133",
		}},

		// S.No 190 - WW 225 - B.E. EI - 22EI401
		{HallNo: "WW 225", CourseCode: "22EI401", RegisterNos: []string{"7376251EI502"}},

		// S.No 191 - WW 225 - B.E. ME - 22ME401
		{HallNo: "WW 225", CourseCode: "22ME401", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241ME116", "7376241ME132")...)
			r = append(r, expandRange("7376241ME134", "7376241ME141")...)
			return r
		}()},

		// S.No 192 - WW 225 - B.Tech. CB - 22CB401
		{HallNo: "WW 225", CourseCode: "22CB401", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242CB102", "7376242CB105")...)
			r = append(r, expandRange("7376242CB107", "7376242CB123")...)
			return r
		}()},

		// S.No 193 - WW 226 - B.E. ME - 22ME401
		{HallNo: "WW 226", CourseCode: "22ME401", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241ME142", "7376241ME159")...)
			r = append(r, expandRange("7376251ME501", "7376251ME507")...)
			return r
		}()},

		// S.No 194 - WW 226 - B.Tech. CB - 22CB401
		{HallNo: "WW 226", CourseCode: "22CB401", RegisterNos: expandRange("7376242CB124", "7376242CB148")},

		// S.No 195 - WW 227 - B.E. SE - 22IS401
		{HallNo: "WW 227", CourseCode: "22IS401", RegisterNos: []string{
			"7376221SE108", "7376221SE134", "7376221SE140", "7376231SE504",
		}},

		// S.No 196 - WW 227 - B.Tech. AG - 22AG401
		{HallNo: "WW 227", CourseCode: "22AG401", RegisterNos: []string{"7376222AG120"}},

		// S.No 197 - WW 227 - B.E. SE - 22IS401
		{HallNo: "WW 227", CourseCode: "22IS401", RegisterNos: []string{
			"7376231SE103", "7376231SE122", "7376231SE137", "7376231SE139",
			"7376231SE153", "7376241SE501",
		}},

		// S.No 198 - WW 227 - B.Tech. CB - 22CB401
		{HallNo: "WW 227", CourseCode: "22CB401", RegisterNos: []string{"7376242CB502"}},

		// S.No 199 - WW 227 - B.E. ME - 22ME401
		{HallNo: "WW 227", CourseCode: "22ME401", RegisterNos: []string{"7376251ME508"}},

		// S.No 200 - WW 227 - B.Tech. CB - 22CB401
		{HallNo: "WW 227", CourseCode: "22CB401", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242CB149", "7376242CB159")...)
			r = append(r, expandRange("7376252CB501", "7376252CB503")...)
			return r
		}()},

		// S.No 201 - WW 227 - B.Tech. AG - 22AG401
		{HallNo: "WW 227", CourseCode: "22AG401", RegisterNos: expandRange("7376242AG101", "7376242AG123")},
	}
}

// buildSeatingData09AN returns all seating records from the 09-05-2026 AN exam
// Exam Date: 09-05-2026 | Session: AN - 01:30 PM to 04:30 PM
func buildSeatingData09AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.E. EC - 22EC303
		{HallNo: "EW 101", CourseCode: "22EC303", RegisterNos: []string{
			"7376221EC102", "7376221EC107", "7376221EC116",
		}},

		// S.No 2 - EW 101 - 22EC303
		{HallNo: "EW 101", CourseCode: "22EC303", RegisterNos: []string{
			"7376231EC101", "7376231EC110", "7376231EC112", "7376231EC208",
			"7376231EC283", "7376231EC297", "7376231EC305", "7376231EC331",
			"7376231EC334",
		}},

		// S.No 3 - EW 101 - B.Tech. AD - 22AI303
		{HallNo: "EW 101", CourseCode: "22AI303", RegisterNos: []string{"7376232AD250"}},

		// S.No 4 - EW 101 - B.E. EC - 22EC303
		{HallNo: "EW 101", CourseCode: "22EC303", RegisterNos: []string{
			"7376241EC137", "7376241EC138", "7376241EC145",
		}},

		// S.No 5 - EW 101 - B.Tech. AD - 22AI303
		{HallNo: "EW 101", CourseCode: "22AI303", RegisterNos: []string{
			"7376242AD137", "7376242AD146", "7376242AD189", "7376242AD190",
			"7376242AD202", "7376242AD218", "7376242AD291", "7376242AD301",
			"7376242AD320",
		}},

		// S.No 6 - EW 102 - B.E. EE - 22EE303
		{HallNo: "EW 102", CourseCode: "22EE303", RegisterNos: []string{"7376231EE115"}},

		// S.No 7 - EW 102 - B.E. MZ - 22MC303
		{HallNo: "EW 102", CourseCode: "22MC303", RegisterNos: []string{
			"7376231MZ106", "7376231MZ107", "7376231MZ111", "7376231MZ113",
			"7376231MZ135",
		}},

		// S.No 8 - EW 102 - B.Tech. AD - 22AI303
		{HallNo: "EW 102", CourseCode: "22AI303", RegisterNos: []string{"7376242AD510"}},

		// S.No 9 - EW 102 - B.E. EC - 22EC303
		{HallNo: "EW 102", CourseCode: "22EC303", RegisterNos: []string{
			"7376241EC201", "7376241EC243", "7376241EC256", "7376241EC271",
			"7376241EC302", "7376241EC312", "7376241EC333", "7376251EC509",
			"7376251EC511", "7376251EC517", "7376251EC518", "7376251EC519",
			"7376251EC521",
		}},

		// S.No 10 - EW 102 - B.E. EE - 22EE303
		{HallNo: "EW 102", CourseCode: "22EE303", RegisterNos: []string{"7376241EE130"}},

		// S.No 11 - EW 102 - B.E. MZ - 22MC303
		{HallNo: "EW 102", CourseCode: "22MC303", RegisterNos: []string{"7376241MZ112"}},

		// S.No 12 - EW 102 - B.Tech. AD - 22AI303
		{HallNo: "EW 102", CourseCode: "22AI303", RegisterNos: []string{
			"7376242AD326", "7376252AD510", "7376252AD515",
		}},

		// S.No 13 - EW 103 - B.E. EI - 22EI303
		{HallNo: "EW 103", CourseCode: "22EI303", RegisterNos: []string{"7376231EI503"}},

		// S.No 14 - EW 103 - 22EI303
		{HallNo: "EW 103", CourseCode: "22EI303", RegisterNos: []string{"7376231EI159"}},

		// S.No 15 - EW 103 - B.E. MZ - 22MC303
		{HallNo: "EW 103", CourseCode: "22MC303", RegisterNos: []string{"7376241MZ501"}},

		// S.No 16 - EW 103 - B.Tech. IT - 22IT303
		{HallNo: "EW 103", CourseCode: "22IT303", RegisterNos: []string{"7376232IT118"}},

		// S.No 17 - EW 103 - B.E. EE - 22EE303
		{HallNo: "EW 103", CourseCode: "22EE303", RegisterNos: []string{
			"7376241EE132", "7376241EE146", "7376241EE147", "7376241EE157",
			"7376241EE193", "7376241EE211", "7376241EE213", "7376251EE502",
			"7376251EE506", "7376251EE508", "7376251EE510", "7376251EE514",
		}},

		// S.No 18 - EW 103 - B.E. MZ - 22MC303
		{HallNo: "EW 103", CourseCode: "22MC303", RegisterNos: []string{
			"7376241MZ124", "7376241MZ127", "7376241MZ139", "7376241MZ143",
			"7376251MZ504", "7376251MZ505", "7376251MZ506",
		}},

		// S.No 19 - EW 103 - B.Tech. IT - 22IT303
		{HallNo: "EW 103", CourseCode: "22IT303", RegisterNos: []string{
			"7376242IT146", "7376242IT184",
		}},

		// S.No 20 - EW 104 - B.E. CS - 22CS303
		{HallNo: "EW 104", CourseCode: "22CS303", RegisterNos: []string{
			"7376221CS118", "7376221CS288",
		}},

		// S.No 21 - EW 104 - B.E. ME - 22ME303
		{HallNo: "EW 104", CourseCode: "22ME303", RegisterNos: []string{"7376221ME154"}},

		// S.No 22 - EW 104 - B.E. CS - 22CS303
		{HallNo: "EW 104", CourseCode: "22CS303", RegisterNos: []string{
			"7376231CS244", "7376231CS259",
		}},

		// S.No 23 - EW 104 - B.E. ME - 22ME303
		{HallNo: "EW 104", CourseCode: "22ME303", RegisterNos: []string{"7376231ME149"}},

		// S.No 24 - EW 104 - B.E. CS - 22CS303
		{HallNo: "EW 104", CourseCode: "22CS303", RegisterNos: []string{"7376241CS230"}},

		// S.No 25 - EW 104 - B.E. EI - 22EI303
		{HallNo: "EW 104", CourseCode: "22EI303", RegisterNos: []string{
			"7376241EI104", "7376251EI501", "7376251EI502",
		}},

		// S.No 26 - EW 104 - B.E. ME - 22ME303
		{HallNo: "EW 104", CourseCode: "22ME303", RegisterNos: []string{
			"7376241ME104", "7376241ME123", "7376241ME127",
		}},

		// S.No 27 - EW 104 - B.Tech. BT - 22BT303
		{HallNo: "EW 104", CourseCode: "22BT303", RegisterNos: []string{"7376242BT156"}},

		// S.No 28 - EW 104 - B.Tech. IT - 22IT303
		{HallNo: "EW 104", CourseCode: "22IT303", RegisterNos: []string{
			"7376242IT188", "7376242IT214", "7376242IT227", "7376252IT502",
			"7376252IT504", "7376252IT507", "7376252IT508", "7376252IT511",
			"7376252IT512",
		}},

		// S.No 29 - EW 104 - B.Tech. AL - 22AM303
		{HallNo: "EW 104", CourseCode: "22AM303", RegisterNos: []string{
			"7376242AL169", "7376242AL207",
		}},

		// S.No 30 - EW 105 - B.E. CE - 22CE303
		{HallNo: "EW 105", CourseCode: "22CE303", RegisterNos: []string{"7376221CE124"}},

		// S.No 31 - EW 105 - B.E. MC - 22MC303
		{HallNo: "EW 105", CourseCode: "22MC303", RegisterNos: []string{
			"7376221MC125", "7376231MC507",
		}},

		// S.No 32 - EW 105 - B.E. SE - 22IS303
		{HallNo: "EW 105", CourseCode: "22IS303", RegisterNos: []string{
			"7376221SE134", "7376231SE504",
		}},

		// S.No 33 - EW 105 - B.E. CD - 22CD303
		{HallNo: "EW 105", CourseCode: "22CD303", RegisterNos: []string{"7376221CD114"}},

		// S.No 34 - EW 105 - B.Tech. FD - 22FD303
		{HallNo: "EW 105", CourseCode: "22FD303", RegisterNos: []string{"7376222FD107"}},

		// S.No 35 - EW 105 - B.Tech. AD - 22AI303
		{HallNo: "EW 105", CourseCode: "22AI303", RegisterNos: []string{"7376232AD502"}},

		// S.No 36 - EW 105 - B.E. CE - 22CE303
		{HallNo: "EW 105", CourseCode: "22CE303", RegisterNos: []string{"7376241CE501"}},

		// S.No 37 - EW 105 - B.E. BM - 22BM303
		{HallNo: "EW 105", CourseCode: "22BM303", RegisterNos: []string{
			"7376231BM107", "7376241BM501",
		}},

		// S.No 38 - EW 105 - B.E. SE - 22IS303
		{HallNo: "EW 105", CourseCode: "22IS303", RegisterNos: []string{"7376231SE144"}},

		// S.No 39 - EW 105 - B.E. CD - 22CD303
		{HallNo: "EW 105", CourseCode: "22CD303", RegisterNos: []string{"7376241CD501"}},

		// S.No 40 - EW 105 - B.Tech. CT - 22CT303
		{HallNo: "EW 105", CourseCode: "22CT303", RegisterNos: []string{"7376232CT122"}},

		// S.No 41 - EW 105 - B.Tech. AG - 22AG303
		{HallNo: "EW 105", CourseCode: "22AG303", RegisterNos: []string{"7376232AG151"}},

		// S.No 42 - EW 105 - B.E. CS - 22CS303
		{HallNo: "EW 105", CourseCode: "22CS303", RegisterNos: []string{
			"7376241CS395", "7376251CS512",
		}},

		// S.No 43 - EW 105 - B.Tech. BT - 22BT303
		{HallNo: "EW 105", CourseCode: "22BT303", RegisterNos: []string{"7376242BT219"}},

		// S.No 44 - EW 105 - B.Tech. CB - 22CB303
		{HallNo: "EW 105", CourseCode: "22CB303", RegisterNos: []string{"7376242CB119"}},
	}
}

// LookupHall returns the hall number for a given register number and course code.
// It searches across all ten sessions: 04-05-2026 FN, 04-05-2026 AN,
// 05-05-2026 FN, 05-05-2026 AN, 07-05-2026 FN, 07-05-2026 AN,
// 08-05-2026 FN, 08-05-2026 AN, 09-05-2026 FN, and 09-05-2026 AN.
// Register number lookup is case-insensitive and ignores leading/trailing spaces.
func LookupHall(registerNo, courseCode string) (string, bool) {
	registerNo = strings.TrimSpace(strings.ToUpper(registerNo))
	courseCode = strings.TrimSpace(strings.ToUpper(courseCode))

	allRecords := append(buildSeatingData(), buildSeatingDataAN()...)
	allRecords = append(allRecords, buildSeatingData05FN()...)
	allRecords = append(allRecords, buildSeatingData05AN()...)
	allRecords = append(allRecords, buildSeatingData07FN()...)
	allRecords = append(allRecords, buildSeatingData07AN()...)
	allRecords = append(allRecords, buildSeatingData08FN()...)
	allRecords = append(allRecords, buildSeatingData08AN()...)
	allRecords = append(allRecords, buildSeatingData09FN()...)
	allRecords = append(allRecords, buildSeatingData09AN()...)

	for _, record := range allRecords {
		if strings.ToUpper(record.CourseCode) != courseCode {
			continue
		}
		for _, reg := range record.RegisterNos {
			if strings.ToUpper(reg) == registerNo {
				return record.HallNo, true
			}
		}
	}
	return "", false
}