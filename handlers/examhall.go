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

// LookupHall returns the hall number for a given register number and course code.
// It searches across all six sessions: 04-05-2026 FN, 04-05-2026 AN,
// 05-05-2026 FN, 05-05-2026 AN, 07-05-2026 FN, and 07-05-2026 AN.
// Register number lookup is case-insensitive and ignores leading/trailing spaces.
func LookupHall(registerNo, courseCode string) (string, bool) {
	registerNo = strings.TrimSpace(strings.ToUpper(registerNo))
	courseCode = strings.TrimSpace(strings.ToUpper(courseCode))

	allRecords := append(buildSeatingData(), buildSeatingDataAN()...)
	allRecords = append(allRecords, buildSeatingData05FN()...)
	allRecords = append(allRecords, buildSeatingData05AN()...)
	allRecords = append(allRecords, buildSeatingData07FN()...)
	allRecords = append(allRecords, buildSeatingData07AN()...)

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