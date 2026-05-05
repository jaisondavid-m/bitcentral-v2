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

// LookupHall returns the hall number for a given register number and course code.
// It searches across all four sessions: 04-05-2026 FN, 04-05-2026 AN,
// 05-05-2026 FN, and 05-05-2026 AN.
// Register number lookup is case-insensitive and ignores leading/trailing spaces.
func LookupHall(registerNo, courseCode string) (string, bool) {
	registerNo = strings.TrimSpace(strings.ToUpper(registerNo))
	courseCode = strings.TrimSpace(strings.ToUpper(courseCode))

	allRecords := append(buildSeatingData(), buildSeatingDataAN()...)
	allRecords = append(allRecords, buildSeatingData05FN()...)
	allRecords = append(allRecords, buildSeatingData05AN()...)

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