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

// buildSeatingData11FN returns all seating records from the 11-05-2026 FN exam
// Exam Date: 11-05-2026 | Session: FN - 09:00 AM to 12:00 PM
func buildSeatingData11FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - AE 302 - B.E. CS - 22CS601
		{HallNo: "AE 302", CourseCode: "22CS601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS153", "7376231CS166")...)
			r = append(r, "7376231CS168")
			return r
		}()},

		// S.No 2 - AE 302 - B.E. EC - 22EC601
		{HallNo: "AE 302", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC128", "7376231EC137")},

		// S.No 3 - EW 101 - B.E. CS - 22CS601
		{HallNo: "EW 101", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS169", "7376231CS183")},

		// S.No 4 - EW 101 - B.E. EC - 22EC601
		{HallNo: "EW 101", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC138", "7376231EC147")},

		// S.No 5 - EW 102 - B.E. CS - 22CS601
		{HallNo: "EW 102", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS184", "7376231CS198")},

		// S.No 6 - EW 102 - B.E. EC - 22EC601
		{HallNo: "EW 102", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC148", "7376231EC157")},

		// S.No 7 - EW 103 - B.E. CS - 22CS601
		{HallNo: "EW 103", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS244", "7376231CS258")},

		// S.No 8 - EW 103 - B.E. EC - 22EC601
		{HallNo: "EW 103", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC188", "7376231EC197")},

		// S.No 9 - EW 104 - B.E. CS - 22CS601
		{HallNo: "EW 104", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS337", "7376231CS351")},

		// S.No 10 - EW 104 - B.E. EC - 22EC601
		{HallNo: "EW 104", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC248", "7376231EC257")},

		// S.No 11 - EW 105 - B.E. CS - 22CS601
		{HallNo: "EW 105", CourseCode: "22CS601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS352", "7376231CS354")...)
			r = append(r, expandRange("7376241CS501", "7376241CS512")...)
			return r
		}()},

		// S.No 12 - EW 105 - B.E. EC - 22EC601
		{HallNo: "EW 105", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC258", "7376231EC267")},

		// S.No 13 - EW 106 - 22EC601
		{HallNo: "EW 106", CourseCode: "22EC601", RegisterNos: expandRange("7376241EC505", "7376241EC514")},

		// S.No 14 - EW 106 - B.Tech. AD - 22AI601
		{HallNo: "EW 106", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD195", "7376232AD209")},

		// S.No 15 - EW 107 - B.E. CS - 22CS601
		{HallNo: "EW 107", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS214", "7376231CS228")},

		// S.No 16 - EW 107 - B.E. EC - 22EC601
		{HallNo: "EW 107", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC168", "7376231EC177")},

		// S.No 17 - EW 108 - B.E. CS - 22CS601
		{HallNo: "EW 108", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS259", "7376231CS273")},

		// S.No 18 - EW 108 - B.E. EC - 22EC601
		{HallNo: "EW 108", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC198", "7376231EC207")},

		// S.No 19 - EW 109 - B.E. CS - 22CS601
		{HallNo: "EW 109", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS290", "7376231CS304")},

		// S.No 20 - EW 109 - B.E. EC - 22EC601
		{HallNo: "EW 109", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC218", "7376231EC227")},

		// S.No 21 - EW 111 - B.E. CS - 22CS601
		{HallNo: "EW 111", CourseCode: "22CS601", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CS320", "7376231CS321")
			r = append(r, expandRange("7376231CS323", "7376231CS326")...)
			r = append(r, expandRange("7376231CS328", "7376231CS336")...)
			return r
		}()},

		// S.No 22 - EW 111 - B.E. EC - 22EC601
		{HallNo: "EW 111", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC238", "7376231EC247")},

		// S.No 23 - EW 112 - B.E. CS - 22CS601
		{HallNo: "EW 112", CourseCode: "22CS601", RegisterNos: []string{
			"7376241CS513", "7376241CS514", "7376241CS515", "7376241CS516",
			"7376241CS518", "7376241CS519",
		}},

		// S.No 24 - EW 112 - B.E. EC - 22EC601
		{HallNo: "EW 112", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC268", "7376231EC277")},

		// S.No 25 - EW 112 - B.Tech. AD - 22AI601
		{HallNo: "EW 112", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD101", "7376232AD109")},

		// S.No 26 - EW 113 - B.Tech. IT - 22IT601
		{HallNo: "EW 113", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT238", "7376232IT247")},

		// S.No 27 - EW 113 - B.Tech. AL - 22AM601
		{HallNo: "EW 113", CourseCode: "22AM601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AL208", "7376232AL221")...)
			r = append(r, "7376242AL501")
			return r
		}()},

		// S.No 28 - EW 114 - B.E. CD - 22CD601
		{HallNo: "EW 114", CourseCode: "22CD601", RegisterNos: []string{
			"7376221CD114", "7376221CD126", "7376221CD153",
		}},

		// S.No 29 - EW 114 - B.E. ME - 22ME601
		{HallNo: "EW 114", CourseCode: "22ME601", RegisterNos: expandRange("7376241ME501", "7376241ME505")},

		// S.No 30 - EW 114 - B.E. CD - 22CD601
		{HallNo: "EW 114", CourseCode: "22CD601", RegisterNos: expandRange("7376231CD102", "7376231CD108")},

		// S.No 31 - EW 114 - B.Tech. BT - 22BT601
		{HallNo: "EW 114", CourseCode: "22BT601", RegisterNos: expandRange("7376232BT101", "7376232BT110")},

		// S.No 32 - EW 115 - B.E. CD - 22CD601
		{HallNo: "EW 115", CourseCode: "22CD601", RegisterNos: expandRange("7376231CD144", "7376231CD158")},

		// S.No 33 - EW 115 - B.Tech. BT - 22BT601
		{HallNo: "EW 115", CourseCode: "22BT601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232BT147", "7376232BT149")...)
			r = append(r, expandRange("7376232BT151", "7376232BT157")...)
			return r
		}()},

		// S.No 34 - EW 116 - B.E. CD - 22CD601
		{HallNo: "EW 116", CourseCode: "22CD601", RegisterNos: []string{"7376231CD503"}},

		// S.No 35 - EW 116 - 22CD601
		{HallNo: "EW 116", CourseCode: "22CD601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CD159", "7376231CD162")...)
			r = append(r, expandRange("7376241CD501", "7376241CD503")...)
			return r
		}()},

		// S.No 36 - EW 116 - B.Tech. BT - 22BT601
		{HallNo: "EW 116", CourseCode: "22BT601", RegisterNos: expandRange("7376232BT158", "7376232BT167")},

		// S.No 37 - EW 116 - B.Tech. CT - 22CT601
		{HallNo: "EW 116", CourseCode: "22CT601", RegisterNos: expandRange("7376232CT101", "7376232CT107")},

		// S.No 38 - EW 117 - B.Tech. BT - 22BT601
		{HallNo: "EW 117", CourseCode: "22BT601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232BT178", "7376232BT185")...)
			r = append(r, "7376232BT187", "7376232BT188")
			return r
		}()},

		// S.No 39 - EW 117 - B.Tech. CT - 22CT601
		{HallNo: "EW 117", CourseCode: "22CT601", RegisterNos: expandRange("7376232CT123", "7376232CT137")},

		// S.No 40 - EW 118 - B.E. MZ - 22MC601
		{HallNo: "EW 118", CourseCode: "22MC601", RegisterNos: []string{"7376231MZ101", "7376231MZ102"}},

		// S.No 41 - EW 118 - B.Tech. BT - 22BT601
		{HallNo: "EW 118", CourseCode: "22BT601", RegisterNos: expandRange("7376232BT199", "7376232BT208")},

		// S.No 42 - EW 118 - B.Tech. CT - 22CT601
		{HallNo: "EW 118", CourseCode: "22CT601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232CT153", "7376232CT162")...)
			r = append(r, expandRange("7376242CT501", "7376242CT503")...)
			return r
		}()},

		// S.No 43 - EW 201 - B.Tech. IT - 22IT601
		{HallNo: "EW 201", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT111", "7376232IT120")},

		// S.No 44 - EW 201 - B.Tech. AD - 22AI601
		{HallNo: "EW 201", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD240", "7376232AD254")},

		// S.No 45 - EW 202 - B.Tech. IT - 22IT601
		{HallNo: "EW 202", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT131", "7376232IT140")},

		// S.No 46 - EW 202 - B.Tech. AD - 22AI601
		{HallNo: "EW 202", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD270", "7376232AD284")},

		// S.No 47 - EW 203 - B.E. ME - 22ME601
		{HallNo: "EW 203", CourseCode: "22ME601", RegisterNos: []string{
			"7376221ME111", "7376221ME138", "7376221ME154",
		}},

		// S.No 48 - EW 203 - 22ME601
		{HallNo: "EW 203", CourseCode: "22ME601", RegisterNos: expandRange("7376231ME101", "7376231ME106")},

		// S.No 49 - EW 203 - B.Tech. IT - 22IT601
		{HallNo: "EW 203", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT248", "7376232IT257")},

		// S.No 50 - EW 203 - B.Tech. AL - 22AM601
		{HallNo: "EW 203", CourseCode: "22AM601", RegisterNos: expandRange("7376242AL502", "7376242AL507")},

		// S.No 51 - EW 204 - B.E. ME - 22ME601
		{HallNo: "EW 204", CourseCode: "22ME601", RegisterNos: expandRange("7376231ME137", "7376231ME146")},

		// S.No 52 - EW 204 - B.Tech. IT - 22IT601
		{HallNo: "EW 204", CourseCode: "22IT601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232IT278", "7376232IT281")...)
			r = append(r, expandRange("7376232IT283", "7376232IT286")...)
			r = append(r, "7376242IT501", "7376242IT502")
			return r
		}()},

		// S.No 53 - EW 205 - B.E. CD - 22CD601
		{HallNo: "EW 205", CourseCode: "22CD601", RegisterNos: expandRange("7376231CD109", "7376231CD118")},

		// S.No 54 - EW 205 - B.Tech. BT - 22BT601
		{HallNo: "EW 205", CourseCode: "22BT601", RegisterNos: expandRange("7376232BT111", "7376232BT120")},

		// S.No 55 - EW 206 - B.E. CD - 22CD601
		{HallNo: "EW 206", CourseCode: "22CD601", RegisterNos: expandRange("7376231CD119", "7376231CD143")},

		// S.No 56 - EW 206 - B.Tech. BT - 22BT601
		{HallNo: "EW 206", CourseCode: "22BT601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232BT121", "7376232BT127")...)
			r = append(r, expandRange("7376232BT129", "7376232BT146")...)
			return r
		}()},

		// S.No 57 - EW 207 - B.E. EC - 22EC601
		{HallNo: "EW 207", CourseCode: "22EC601", RegisterNos: []string{
			"7376231EC504", "7376231EC506", "7376231EC507", "7376231EC514",
		}},

		// S.No 58 - EW 207 - 22EC601
		{HallNo: "EW 207", CourseCode: "22EC601", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC333", "7376231EC334")
			r = append(r, expandRange("7376241EC501", "7376241EC504")...)
			return r
		}()},

		// S.No 59 - EW 207 - B.Tech. AD - 22AI601
		{HallNo: "EW 207", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD180", "7376232AD194")},

		// S.No 60 - EW 208 - B.Tech. IT - 22IT601
		{HallNo: "EW 208", CourseCode: "22IT601", RegisterNos: []string{"7376212IT105", "7376222IT110"}},

		// S.No 61 - EW 208 - B.E. EC - 22EC601
		{HallNo: "EW 208", CourseCode: "22EC601", RegisterNos: expandRange("7376241EC515", "7376241EC522")},

		// S.No 62 - EW 208 - B.Tech. AD - 22AI601
		{HallNo: "EW 208", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD210", "7376232AD224")},

		// S.No 63 - EW 209 - B.Tech. IT - 22IT601
		{HallNo: "EW 209", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT121", "7376232IT130")},

		// S.No 64 - EW 209 - B.Tech. AD - 22AI601
		{HallNo: "EW 209", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD255", "7376232AD269")},

		// S.No 65 - EW 210 - B.Tech. IT - 22IT601
		{HallNo: "EW 210", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT151", "7376232IT160")},

		// S.No 66 - EW 210 - B.Tech. AL - 22AM601
		{HallNo: "EW 210", CourseCode: "22AM601", RegisterNos: expandRange("7376232AL102", "7376232AL111")},

		// S.No 67 - EW 211 - B.Tech. IT - 22IT601
		{HallNo: "EW 211", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT192", "7376232IT201")},

		// S.No 68 - EW 211 - B.Tech. AL - 22AM601
		{HallNo: "EW 211", CourseCode: "22AM601", RegisterNos: expandRange("7376232AL157", "7376232AL166")},

		// S.No 69 - EW 212 - B.Tech. IT - 22IT601
		{HallNo: "EW 212", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT202", "7376232IT226")},

		// S.No 70 - EW 212 - B.Tech. AL - 22AM601
		{HallNo: "EW 212", CourseCode: "22AM601", RegisterNos: expandRange("7376232AL167", "7376232AL191")},

		// S.No 71 - EW 213 - B.Tech. CB - 22CB601
		{HallNo: "EW 213", CourseCode: "22CB601", RegisterNos: []string{
			"7376222CB121", "7376222CB150", "7376222CB153",
		}},

		// S.No 72 - EW 213 - B.E. MZ - 22MC601
		{HallNo: "EW 213", CourseCode: "22MC601", RegisterNos: expandRange("7376231MZ103", "7376231MZ117")},

		// S.No 73 - EW 213 - B.Tech. BT - 22BT601
		{HallNo: "EW 213", CourseCode: "22BT601", RegisterNos: expandRange("7376232BT209", "7376232BT215")},

		// S.No 74 - EW 214 - B.E. MZ - 22MC601
		{HallNo: "EW 214", CourseCode: "22MC601", RegisterNos: expandRange("7376231MZ118", "7376231MZ132")},

		// S.No 75 - EW 214 - B.Tech. CB - 22CB601
		{HallNo: "EW 214", CourseCode: "22CB601", RegisterNos: expandRange("7376232CB101", "7376232CB110")},

		// S.No 76 - EW 215 - B.E. MZ - 22MC601
		{HallNo: "EW 215", CourseCode: "22MC601", RegisterNos: expandRange("7376231MZ133", "7376231MZ147")},

		// S.No 77 - EW 215 - B.Tech. CB - 22CB601
		{HallNo: "EW 215", CourseCode: "22CB601", RegisterNos: expandRange("7376232CB111", "7376232CB120")},

		// S.No 78 - EW 216 - B.E. MZ - 22MC601
		{HallNo: "EW 216", CourseCode: "22MC601", RegisterNos: expandRange("7376231MZ148", "7376231MZ157")},

		// S.No 79 - EW 216 - B.Tech. CB - 22CB601
		{HallNo: "EW 216", CourseCode: "22CB601", RegisterNos: expandRange("7376232CB121", "7376232CB130")},

		// S.No 80 - EW 217 - B.Tech. AG - 22AG601
		{HallNo: "EW 217", CourseCode: "22AG601", RegisterNos: []string{"7376222AG120", "7376222AG158"}},

		// S.No 81 - EW 217 - B.E. MZ - 22MC601
		{HallNo: "EW 217", CourseCode: "22MC601", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231MZ158")
			r = append(r, expandRange("7376241MZ501", "7376241MZ506")...)
			return r
		}()},

		// S.No 82 - EW 217 - B.Tech. CB - 22CB601
		{HallNo: "EW 217", CourseCode: "22CB601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232CB131", "7376232CB137")...)
			r = append(r, expandRange("7376232CB139", "7376232CB141")...)
			return r
		}()},

		// S.No 83 - EW 217 - B.Tech. AG - 22AG601
		{HallNo: "EW 217", CourseCode: "22AG601", RegisterNos: []string{"7376232AG102"}},

		// S.No 84 - EW 218 - B.Tech. CB - 22CB601
		{HallNo: "EW 218", CourseCode: "22CB601", RegisterNos: []string{"7376232CB501", "7376232CB504"}},

		// S.No 85 - EW 218 - 22CB601
		{HallNo: "EW 218", CourseCode: "22CB601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232CB142", "7376232CB157")...)
			r = append(r, expandRange("7376232CB159", "7376232CB163")...)
			r = append(r, "7376242CB502", "7376242CB503")
			return r
		}()},

		// S.No 86 - EW 218 - B.Tech. AG - 22AG601
		{HallNo: "EW 218", CourseCode: "22AG601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AG103", "7376232AG109")...)
			r = append(r, expandRange("7376232AG111", "7376232AG128")...)
			return r
		}()},

		// S.No 87 - MH 301 - B.E. CS - 22CS601
		{HallNo: "MH 301", CourseCode: "22CS601", RegisterNos: []string{
			"7376221CS109", "7376221CS114", "7376221CS118", "7376221CS140",
			"7376221CS196", "7376221CS240", "7376221CS275", "7376221CS288",
		}},

		// S.No 88 - MH 301 - B.E. EC - 22EC601
		{HallNo: "MH 301", CourseCode: "22EC601", RegisterNos: []string{
			"7376221EC107", "7376221EC116", "7376221EC129", "7376221EC139",
			"7376221EC149", "7376221EC151", "7376221EC192", "7376221EC226",
			"7376221EC244", "7376221EC273",
		}},

		// S.No 89 - MH 301 - B.E. CS - 22CS601
		{HallNo: "MH 301", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS101", "7376231CS107")},

		// S.No 90 - MH 302 - B.E. EC - 22EC601
		{HallNo: "MH 302", CourseCode: "22EC601", RegisterNos: []string{
			"7376221EC290", "7376221EC307", "7376221EC337",
		}},

		// S.No 91 - MH 302 - B.E. CS - 22CS601
		{HallNo: "MH 302", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS108", "7376231CS122")},

		// S.No 92 - MH 302 - B.E. EC - 22EC601
		{HallNo: "MH 302", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC101", "7376231EC107")},

		// S.No 93 - MH 303 - B.E. CS - 22CS601
		{HallNo: "MH 303", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS123", "7376231CS137")},

		// S.No 94 - MH 303 - B.E. EC - 22EC601
		{HallNo: "MH 303", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC108", "7376231EC117")},

		// S.No 95 - MH 305 - B.E. CS - 22CS601
		{HallNo: "MH 305", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS138", "7376231CS152")},

		// S.No 96 - MH 305 - B.E. EC - 22EC601
		{HallNo: "MH 305", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC118", "7376231EC127")},

		// S.No 97 - WW 005 - B.Tech. IT - 22IT601
		{HallNo: "WW 005", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT228", "7376232IT237")},

		// S.No 98 - WW 005 - B.Tech. AL - 22AM601
		{HallNo: "WW 005", CourseCode: "22AM601", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AL192", "7376232AL193")
			r = append(r, expandRange("7376232AL195", "7376232AL207")...)
			return r
		}()},

		// S.No 99 - WW 006 - B.E. ME - 22ME601
		{HallNo: "WW 006", CourseCode: "22ME601", RegisterNos: expandRange("7376231ME107", "7376231ME121")},

		// S.No 100 - WW 006 - B.Tech. IT - 22IT601
		{HallNo: "WW 006", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT258", "7376232IT267")},

		// S.No 101 - WW 007 - B.E. ME - 22ME601
		{HallNo: "WW 007", CourseCode: "22ME601", RegisterNos: expandRange("7376231ME122", "7376231ME136")},

		// S.No 102 - WW 007 - B.Tech. IT - 22IT601
		{HallNo: "WW 007", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT268", "7376232IT277")},

		// S.No 103 - WW 008 - B.Tech. BT - 22BT601
		{HallNo: "WW 008", CourseCode: "22BT601", RegisterNos: []string{"7376222BT110", "7376222BT152"}},

		// S.No 104 - WW 008 - B.E. ME - 22ME601
		{HallNo: "WW 008", CourseCode: "22ME601", RegisterNos: expandRange("7376231ME147", "7376231ME161")},

		// S.No 105 - WW 008 - B.Tech. IT - 22IT601
		{HallNo: "WW 008", CourseCode: "22IT601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT503", "7376242IT505")...)
			r = append(r, expandRange("7376242IT507", "7376242IT511")...)
			return r
		}()},

		// S.No 106 - WW 011 - B.Tech. BT - 22BT601
		{HallNo: "WW 011", CourseCode: "22BT601", RegisterNos: expandRange("7376232BT168", "7376232BT177")},

		// S.No 107 - WW 011 - B.Tech. CT - 22CT601
		{HallNo: "WW 011", CourseCode: "22CT601", RegisterNos: expandRange("7376232CT108", "7376232CT122")},

		// S.No 108 - WW 012 - B.Tech. BT - 22BT601
		{HallNo: "WW 012", CourseCode: "22BT601", RegisterNos: expandRange("7376232BT189", "7376232BT198")},

		// S.No 109 - WW 012 - B.Tech. CT - 22CT601
		{HallNo: "WW 012", CourseCode: "22CT601", RegisterNos: expandRange("7376232CT138", "7376232CT152")},

		// S.No 110 - WW 113 - B.E. CS - 22CS601
		{HallNo: "WW 113", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS199", "7376231CS213")},

		// S.No 111 - WW 113 - B.E. EC - 22EC601
		{HallNo: "WW 113", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC158", "7376231EC167")},

		// S.No 112 - WW 114 - B.E. CS - 22CS601
		{HallNo: "WW 114", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS229", "7376231CS243")},

		// S.No 113 - WW 114 - B.E. EC - 22EC601
		{HallNo: "WW 114", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC178", "7376231EC187")},

		// S.No 114 - WW 115 - B.E. CS - 22CS601
		{HallNo: "WW 115", CourseCode: "22CS601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS274", "7376231CS287")...)
			r = append(r, "7376231CS289")
			return r
		}()},

		// S.No 115 - WW 115 - B.E. EC - 22EC601
		{HallNo: "WW 115", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC208", "7376231EC217")},

		// S.No 116 - WW 117 - B.E. CS - 22CS601
		{HallNo: "WW 117", CourseCode: "22CS601", RegisterNos: expandRange("7376231CS305", "7376231CS319")},

		// S.No 117 - WW 117 - B.E. EC - 22EC601
		{HallNo: "WW 117", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC228", "7376231EC237")},

		// S.No 118 - WW 118 - 22EC601
		{HallNo: "WW 118", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC278", "7376231EC287")},

		// S.No 119 - WW 118 - B.Tech. AD - 22AI601
		{HallNo: "WW 118", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD110", "7376232AD124")},

		// S.No 120 - WW 202 - B.E. EC - 22EC601
		{HallNo: "WW 202", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC288", "7376231EC312")},

		// S.No 121 - WW 202 - B.Tech. AD - 22AI601
		{HallNo: "WW 202", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD125", "7376232AD149")},

		// S.No 122 - WW 203 - B.E. EC - 22EC601
		{HallNo: "WW 203", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC313", "7376231EC322")},

		// S.No 123 - WW 203 - B.Tech. AD - 22AI601
		{HallNo: "WW 203", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD150", "7376232AD164")},

		// S.No 124 - WW 204 - B.Tech. IT - 22IT601
		{HallNo: "WW 204", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT101", "7376232IT110")},

		// S.No 125 - WW 204 - B.Tech. AD - 22AI601
		{HallNo: "WW 204", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD225", "7376232AD239")},

		// S.No 126 - WW 205 - B.Tech. IT - 22IT601
		{HallNo: "WW 205", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT162", "7376232IT171")},

		// S.No 127 - WW 205 - B.Tech. AL - 22AM601
		{HallNo: "WW 205", CourseCode: "22AM601", RegisterNos: expandRange("7376232AL112", "7376232AL126")},

		// S.No 128 - WW 211 - B.E. EC - 22EC601
		{HallNo: "WW 211", CourseCode: "22EC601", RegisterNos: expandRange("7376231EC323", "7376231EC332")},

		// S.No 129 - WW 211 - B.Tech. AD - 22AI601
		{HallNo: "WW 211", CourseCode: "22AI601", RegisterNos: expandRange("7376232AD165", "7376232AD179")},

		// S.No 130 - WW 212 - B.E. MC - 22MC601
		{HallNo: "WW 212", CourseCode: "22MC601", RegisterNos: []string{
			"7376231MC506", "7376231MC507", "7376231MC509", "7376231MC510",
		}},

		// S.No 131 - WW 212 - B.E. CE - 22CE601
		{HallNo: "WW 212", CourseCode: "22CE601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CE105", "7376231CE129")...)
			r = append(r, expandRange("7376241CE501", "7376241CE504")...)
			return r
		}()},

		// S.No 132 - WW 213 - B.Tech. AD - 22AI601
		{HallNo: "WW 213", CourseCode: "22AI601", RegisterNos: []string{"7376232AD502"}},

		// S.No 133 - WW 213 - B.Tech. AL - 22AM601
		{HallNo: "WW 213", CourseCode: "22AM601", RegisterNos: []string{"7376222AL154"}},

		// S.No 134 - WW 213 - B.Tech. IT - 22IT601
		{HallNo: "WW 213", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT141", "7376232IT150")},

		// S.No 135 - WW 213 - B.Tech. AD - 22AI601
		{HallNo: "WW 213", CourseCode: "22AI601", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AD285", "7376232AD286")
			r = append(r, expandRange("7376242AD501", "7376242AD510")...)
			return r
		}()},

		// S.No 136 - WW 213 - B.Tech. AL - 22AM601
		{HallNo: "WW 213", CourseCode: "22AM601", RegisterNos: []string{"7376232AL101"}},

		// S.No 137 - WW 214 - B.Tech. IT - 22IT601
		{HallNo: "WW 214", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT172", "7376232IT181")},

		// S.No 138 - WW 214 - B.Tech. AL - 22AM601
		{HallNo: "WW 214", CourseCode: "22AM601", RegisterNos: expandRange("7376232AL127", "7376232AL141")},

		// S.No 139 - WW 215 - B.Tech. IT - 22IT601
		{HallNo: "WW 215", CourseCode: "22IT601", RegisterNos: expandRange("7376232IT182", "7376232IT191")},

		// S.No 140 - WW 215 - B.Tech. AL - 22AM601
		{HallNo: "WW 215", CourseCode: "22AM601", RegisterNos: expandRange("7376232AL142", "7376232AL156")},

		// S.No 141 - WW 218 - B.E. EE - 22EE601
		{HallNo: "WW 218", CourseCode: "22EE601", RegisterNos: expandRange("7376231EE102", "7376231EE111")},

		// S.No 142 - WW 218 - B.Tech. AG - 22AG601
		{HallNo: "WW 218", CourseCode: "22AG601", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232AG129")
			r = append(r, expandRange("7376232AG131", "7376232AG144")...)
			return r
		}()},

		// S.No 143 - WW 219 - B.Tech. FD - 22FD601
		{HallNo: "WW 219", CourseCode: "22FD601", RegisterNos: []string{"7376222FD107"}},

		// S.No 144 - WW 219 - B.E. EE - 22EE601
		{HallNo: "WW 219", CourseCode: "22EE601", RegisterNos: expandRange("7376231EE112", "7376231EE121")},

		// S.No 145 - WW 219 - B.Tech. AG - 22AG601
		{HallNo: "WW 219", CourseCode: "22AG601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AG145", "7376232AG154")...)
			r = append(r, expandRange("7376242AG501", "7376242AG504")...)
			return r
		}()},

		// S.No 146 - WW 222 - B.Tech. FD - 22FD601
		{HallNo: "WW 222", CourseCode: "22FD601", RegisterNos: []string{"7376222FD116", "7376222FD125"}},

		// S.No 147 - WW 222 - B.E. EE - 22EE601
		{HallNo: "WW 222", CourseCode: "22EE601", RegisterNos: expandRange("7376231EE122", "7376231EE146")},

		// S.No 148 - WW 222 - B.Tech. FD - 22FD601
		{HallNo: "WW 222", CourseCode: "22FD601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232FD101", "7376232FD103")...)
			r = append(r, expandRange("7376232FD105", "7376232FD120")...)
			r = append(r, expandRange("7376232FD122", "7376232FD125")...)
			return r
		}()},

		// S.No 149 - WW 223 - B.E. EE - 22EE601
		{HallNo: "WW 223", CourseCode: "22EE601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EE147", "7376231EE161")...)
			r = append(r, expandRange("7376241EE501", "7376241EE506")...)
			return r
		}()},

		// S.No 150 - WW 223 - B.E. EI - 22EI601
		{HallNo: "WW 223", CourseCode: "22EI601", RegisterNos: expandRange("7376231EI101", "7376231EI104")},

		// S.No 151 - WW 223 - B.Tech. FD - 22FD601
		{HallNo: "WW 223", CourseCode: "22FD601", RegisterNos: expandRange("7376232FD126", "7376232FD150")},

		// S.No 152 - WW 224 - B.Tech. FT - 22FT601
		{HallNo: "WW 224", CourseCode: "22FT601", RegisterNos: []string{"7376232FT501"}},

		// S.No 153 - WW 224 - B.E. EI - 22EI601
		{HallNo: "WW 224", CourseCode: "22EI601", RegisterNos: expandRange("7376231EI105", "7376231EI131")},

		// S.No 154 - WW 224 - B.Tech. FD - 22FD601
		{HallNo: "WW 224", CourseCode: "22FD601", RegisterNos: []string{"7376232FD151", "7376232FD152"}},

		// S.No 155 - WW 224 - B.Tech. FT - 22FT601
		{HallNo: "WW 224", CourseCode: "22FT601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232FT101", "7376232FT106")...)
			r = append(r, expandRange("7376232FT108", "7376232FT120")...)
			r = append(r, "7376242FT501")
			return r
		}()},

		// S.No 156 - WW 225 - B.E. EI - 22EI601
		{HallNo: "WW 225", CourseCode: "22EI601", RegisterNos: []string{"7376231EI503"}},

		// S.No 157 - WW 225 - B.E. SE - 22IS601
		{HallNo: "WW 225", CourseCode: "22IS601", RegisterNos: []string{"7376221SE134", "7376221SE140"}},

		// S.No 158 - WW 225 - B.E. EI - 22EI601
		{HallNo: "WW 225", CourseCode: "22EI601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EI132", "7376231EI160")...)
			r = append(r, expandRange("7376241EI501", "7376241EI504")...)
			return r
		}()},

		// S.No 159 - WW 225 - B.E. SE - 22IS601
		{HallNo: "WW 225", CourseCode: "22IS601", RegisterNos: expandRange("7376231SE101", "7376231SE114")},

		// S.No 160 - WW 226 - B.E. BM - 22BM601
		{HallNo: "WW 226", CourseCode: "22BM601", RegisterNos: []string{"7376221BM128"}},

		// S.No 161 - WW 226 - B.E. SE - 22IS601
		{HallNo: "WW 226", CourseCode: "22IS601", RegisterNos: []string{"7376231SE504"}},

		// S.No 162 - WW 226 - B.E. BM - 22BM601
		{HallNo: "WW 226", CourseCode: "22BM601", RegisterNos: expandRange("7376231BM101", "7376231BM107")},

		// S.No 163 - WW 226 - B.E. SE - 22IS601
		{HallNo: "WW 226", CourseCode: "22IS601", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231SE115", "7376231SE143")...)
			r = append(r, expandRange("7376231SE145", "7376231SE155")...)
			r = append(r, "7376241SE501")
			return r
		}()},

		// S.No 164 - WW 227 - B.E. CE - 22CE601
		{HallNo: "WW 227", CourseCode: "22CE601", RegisterNos: []string{"7376221CE122", "7376221CE124"}},

		// S.No 165 - WW 227 - B.E. BM - 22BM601
		{HallNo: "WW 227", CourseCode: "22BM601", RegisterNos: []string{"7376231BM502"}},

		// S.No 166 - WW 227 - B.E. CE - 22CE601
		{HallNo: "WW 227", CourseCode: "22CE601", RegisterNos: []string{
			"7376231CE101", "7376231CE103", "7376231CE104",
		}},

		// S.No 167 - WW 227 - B.E. BM - 22BM601
		{HallNo: "WW 227", CourseCode: "22BM601", RegisterNos: expandRange("7376231BM108", "7376231BM151")},
	}
}

// buildSeatingData11AN returns all seating records from the 11-05-2026 AN exam
// Exam Date: 11-05-2026 | Session: AN - 01:30 PM to 04:30 PM
func buildSeatingData11AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 201 - B.E. CS - 22CS504
		{HallNo: "EW 201", CourseCode: "22CS504", RegisterNos: []string{
			"7376221CS240", "7376221CS275", "7376221CS288", "7376221CS322",
		}},

		// S.No 2 - EW 201 - B.E. EC - 22EC504
		{HallNo: "EW 201", CourseCode: "22EC504", RegisterNos: []string{"7376221EC107"}},

		// S.No 3 - EW 201 - B.E. CS - 22CS504
		{HallNo: "EW 201", CourseCode: "22CS504", RegisterNos: []string{
			"7376231CS102", "7376231CS139", "7376231CS190", "7376231CS230",
			"7376231CS235", "7376231CS244", "7376231CS259", "7376231CS282",
		}},

		// S.No 4 - EW 201 - B.E. EC - 22EC504
		{HallNo: "EW 201", CourseCode: "22EC504", RegisterNos: []string{
			"7376231EC101", "7376231EC283",
		}},

		// S.No 5 - EW 201 - B.E. MZ - 22MC504
		{HallNo: "EW 201", CourseCode: "22MC504", RegisterNos: []string{
			"7376231MZ106", "7376231MZ107", "7376231MZ111", "7376231MZ113",
			"7376231MZ114", "7376231MZ135", "7376231MZ145", "7376231MZ154",
			"7376241MZ501",
		}},

		// S.No 6 - EW 201 - B.Tech. CB - 22CB504
		{HallNo: "EW 201", CourseCode: "22CB504", RegisterNos: []string{"7376232CB111"}},

		// S.No 7 - EW 202 - B.E. CE - 22CE504
		{HallNo: "EW 202", CourseCode: "22CE504", RegisterNos: []string{"7376221CE124"}},

		// S.No 8 - EW 202 - B.E. CD - 22CD504
		{HallNo: "EW 202", CourseCode: "22CD504", RegisterNos: []string{"7376221CD114"}},

		// S.No 9 - EW 202 - B.Tech. AG - 22AG504
		{HallNo: "EW 202", CourseCode: "22AG504", RegisterNos: []string{"7376222AG120"}},

		// S.No 10 - EW 202 - B.E. CE - 22CE504
		{HallNo: "EW 202", CourseCode: "22CE504", RegisterNos: []string{
			"7376231CE113", "7376231CE117", "7376231CE120", "7376231CE122",
			"7376241CE501",
		}},

		// S.No 11 - EW 202 - B.E. EC - 22EC504
		{HallNo: "EW 202", CourseCode: "22EC504", RegisterNos: []string{
			"7376231EC305", "7376231EC331", "7376231EC334",
			"7376241EC512", "7376241EC516",
		}},

		// S.No 12 - EW 202 - B.E. CD - 22CD504
		{HallNo: "EW 202", CourseCode: "22CD504", RegisterNos: []string{
			"7376231CD115", "7376231CD143", "7376241CD501", "7376241CD502",
		}},

		// S.No 13 - EW 202 - B.Tech. CB - 22CB504
		{HallNo: "EW 202", CourseCode: "22CB504", RegisterNos: []string{
			"7376232CB123", "7376232CB133", "7376232CB144",
			"7376242CB502", "7376242CB503",
		}},

		// S.No 14 - EW 202 - B.Tech. AG - 22AG504
		{HallNo: "EW 202", CourseCode: "22AG504", RegisterNos: []string{
			"7376232AG129", "7376232AG151", "7376232AG153",
		}},

		// S.No 15 - EW 206 - B.E. EI - 22EI504
		{HallNo: "EW 206", CourseCode: "22EI504", RegisterNos: []string{"7376231EI503"}},

		// S.No 16 - EW 206 - B.E. SE - 22IS504
		{HallNo: "EW 206", CourseCode: "22IS504", RegisterNos: []string{"7376221SE134", "7376221SE140"}},

		// S.No 17 - EW 206 - B.Tech. BT - 22BT504
		{HallNo: "EW 206", CourseCode: "22BT504", RegisterNos: []string{"7376222BT110"}},

		// S.No 18 - EW 206 - B.Tech. FD - 22FD504
		{HallNo: "EW 206", CourseCode: "22FD504", RegisterNos: []string{"7376222FD107", "7376222FD125"}},

		// S.No 19 - EW 206 - B.Tech. IT - 22IT504
		{HallNo: "EW 206", CourseCode: "22IT504", RegisterNos: []string{"7376222IT110"}},

		// S.No 20 - EW 206 - B.Tech. AD - 22AI504
		{HallNo: "EW 206", CourseCode: "22AI504", RegisterNos: []string{"7376232AD502"}},

		// S.No 21 - EW 206 - B.E. EE - 22EE504
		{HallNo: "EW 206", CourseCode: "22EE504", RegisterNos: []string{"7376231EE111", "7376231EE115"}},

		// S.No 22 - EW 206 - B.E. EI - 22EI504
		{HallNo: "EW 206", CourseCode: "22EI504", RegisterNos: []string{"7376231EI156", "7376231EI159"}},

		// S.No 23 - EW 206 - B.E. ME - 22ME504
		{HallNo: "EW 206", CourseCode: "22ME504", RegisterNos: []string{"7376231ME130"}},

		// S.No 24 - EW 206 - B.E. BM - 22BM504
		{HallNo: "EW 206", CourseCode: "22BM504", RegisterNos: []string{
			"7376231BM107", "7376231BM132", "7376231BM137", "7376231BM148",
		}},

		// S.No 25 - EW 206 - B.E. SE - 22IS504
		{HallNo: "EW 206", CourseCode: "22IS504", RegisterNos: []string{"7376231SE103", "7376231SE128"}},

		// S.No 26 - EW 206 - B.Tech. BT - 22BT504
		{HallNo: "EW 206", CourseCode: "22BT504", RegisterNos: []string{
			"7376232BT115", "7376232BT142", "7376232BT163",
		}},

		// S.No 27 - EW 206 - B.Tech. CT - 22CT504
		{HallNo: "EW 206", CourseCode: "22CT504", RegisterNos: []string{"7376232CT122"}},

		// S.No 28 - EW 206 - B.Tech. AD - 22AI504
		{HallNo: "EW 206", CourseCode: "22AI504", RegisterNos: []string{"7376232AD228", "7376232AD250"}},

		// S.No 29 - EW 206 - B.Tech. AL - 22AM504
		{HallNo: "EW 206", CourseCode: "22AM504", RegisterNos: []string{"7376242AL501"}},
	}
}

// buildSeatingData12FN returns all seating records from the 12-05-2026 FN exam
// Exam Date: 12-05-2026 | Session: FN - 09:00 AM to 12:00 PM
func buildSeatingData12FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - AE 302 - B.E. CS - 22CS402
		{HallNo: "AE 302", CourseCode: "22CS402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS154", "7376241CS157")...)
			r = append(r, expandRange("7376241CS159", "7376241CS169")...)
			return r
		}()},

		// S.No 2 - AE 302 - B.E. EC - 22EC402
		{HallNo: "AE 302", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC127", "7376241EC136")},

		// S.No 3 - EW 101 - B.E. CS - 22CS402
		{HallNo: "EW 101", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS170", "7376241CS184")},

		// S.No 4 - EW 101 - B.E. EC - 22EC402
		{HallNo: "EW 101", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC137", "7376241EC146")},

		// S.No 5 - EW 102 - B.E. CS - 22CS402
		{HallNo: "EW 102", CourseCode: "22CS402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS185", "7376241CS188")...)
			r = append(r, expandRange("7376241CS190", "7376241CS200")...)
			return r
		}()},

		// S.No 6 - EW 102 - B.E. EC - 22EC402
		{HallNo: "EW 102", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC147", "7376241EC156")},

		// S.No 7 - EW 103 - B.E. CS - 22CS402
		{HallNo: "EW 103", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS247", "7376241CS261")},

		// S.No 8 - EW 103 - B.E. EC - 22EC402
		{HallNo: "EW 103", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC188", "7376241EC197")},

		// S.No 9 - EW 104 - B.E. CS - 22CS402
		{HallNo: "EW 104", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS337", "7376241CS351")},

		// S.No 10 - EW 104 - B.E. EC - 22EC402
		{HallNo: "EW 104", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC250", "7376241EC259")},

		// S.No 11 - EW 105 - B.E. CS - 22CS402
		{HallNo: "EW 105", CourseCode: "22CS402", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241CS352", "7376241CS353")
			r = append(r, expandRange("7376241CS355", "7376241CS367")...)
			return r
		}()},

		// S.No 12 - EW 105 - B.E. EC - 22EC402
		{HallNo: "EW 105", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC260", "7376241EC269")},

		// S.No 13 - EW 106 - 22EC402
		{HallNo: "EW 106", CourseCode: "22EC402", RegisterNos: []string{"7376241EC513", "7376241EC515"}},

		// S.No 14 - EW 106 - B.E. CS - 22CS402
		{HallNo: "EW 106", CourseCode: "22CS402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS469", "7376241CS476")...)
			r = append(r, expandRange("7376251CS501", "7376251CS507")...)
			return r
		}()},

		// S.No 15 - EW 106 - B.E. EC - 22EC402
		{HallNo: "EW 106", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC345", "7376241EC352")},

		// S.No 16 - EW 107 - B.E. CS - 22CS402
		{HallNo: "EW 107", CourseCode: "22CS402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS216", "7376241CS228")...)
			r = append(r, "7376241CS230", "7376241CS231")
			return r
		}()},

		// S.No 17 - EW 107 - B.E. EC - 22EC402
		{HallNo: "EW 107", CourseCode: "22EC402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EC167", "7376241EC174")...)
			r = append(r, "7376241EC176", "7376241EC177")
			return r
		}()},

		// S.No 18 - EW 108 - B.E. CS - 22CS402
		{HallNo: "EW 108", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS262", "7376241CS276")},

		// S.No 19 - EW 108 - B.E. EC - 22EC402
		{HallNo: "EW 108", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC198", "7376241EC207")},

		// S.No 20 - EW 109 - B.E. CS - 22CS402
		{HallNo: "EW 109", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS292", "7376241CS306")},

		// S.No 21 - EW 109 - B.E. EC - 22EC402
		{HallNo: "EW 109", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC219", "7376241EC228")},

		// S.No 22 - EW 111 - B.E. CS - 22CS402
		{HallNo: "EW 111", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS322", "7376241CS336")},

		// S.No 23 - EW 111 - B.E. EC - 22EC402
		{HallNo: "EW 111", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC240", "7376241EC249")},

		// S.No 24 - EW 112 - B.E. CS - 22CS402
		{HallNo: "EW 112", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS368", "7376241CS382")},

		// S.No 25 - EW 112 - B.E. EC - 22EC402
		{HallNo: "EW 112", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC270", "7376241EC279")},

		// S.No 26 - EW 113 - B.Tech. IT - 22IT402
		{HallNo: "EW 113", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT282", "7376242IT296")},

		// S.No 27 - EW 113 - B.Tech. AD - 22AI402
		{HallNo: "EW 113", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD232", "7376242AD241")},

		// S.No 28 - EW 114 - B.E. EE - 22EE402
		{HallNo: "EW 114", CourseCode: "22EE402", RegisterNos: []string{"7376231EE111", "7376231EE115"}},

		// S.No 29 - EW 114 - 22EE402
		{HallNo: "EW 114", CourseCode: "22EE402", RegisterNos: expandRange("7376241EE101", "7376241EE110")},

		// S.No 30 - EW 114 - B.Tech. IT - 22IT402
		{HallNo: "EW 114", CourseCode: "22IT402", RegisterNos: expandRange("7376252IT514", "7376252IT516")},

		// S.No 31 - EW 114 - B.Tech. AD - 22AI402
		{HallNo: "EW 114", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD292", "7376242AD301")},

		// S.No 32 - EW 115 - B.E. EE - 22EE402
		{HallNo: "EW 115", CourseCode: "22EE402", RegisterNos: expandRange("7376241EE147", "7376241EE161")},

		// S.No 33 - EW 115 - B.Tech. AD - 22AI402
		{HallNo: "EW 115", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD337", "7376242AD346")},

		// S.No 34 - EW 116 - B.E. EE - 22EE402
		{HallNo: "EW 116", CourseCode: "22EE402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EE162", "7376241EE171")...)
			r = append(r, expandRange("7376241EE173", "7376241EE177")...)
			return r
		}()},

		// S.No 35 - EW 116 - B.Tech. AD - 22AI402
		{HallNo: "EW 116", CourseCode: "22AI402", RegisterNos: expandRange("7376252AD501", "7376252AD510")},

		// S.No 36 - EW 117 - B.E. EE - 22EE402
		{HallNo: "EW 117", CourseCode: "22EE402", RegisterNos: expandRange("7376241EE193", "7376241EE207")},

		// S.No 37 - EW 117 - B.Tech. AL - 22AM402
		{HallNo: "EW 117", CourseCode: "22AM402", RegisterNos: expandRange("7376242AL102", "7376242AL111")},

		// S.No 38 - EW 118 - B.Tech. BT - 22BT402
		{HallNo: "EW 118", CourseCode: "22BT402", RegisterNos: []string{
			"7376232BT142", "7376232BT163", "7376232BT176",
		}},

		// S.No 39 - EW 118 - B.E. EE - 22EE402
		{HallNo: "EW 118", CourseCode: "22EE402", RegisterNos: expandRange("7376251EE506", "7376251EE517")},

		// S.No 40 - EW 118 - B.Tech. AL - 22AM402
		{HallNo: "EW 118", CourseCode: "22AM402", RegisterNos: expandRange("7376242AL122", "7376242AL131")},

		// S.No 41 - EW 201 - B.Tech. AD - 22AI402
		{HallNo: "EW 201", CourseCode: "22AI402", RegisterNos: []string{"7376232AD502"}},

		// S.No 42 - EW 201 - 22AI402
		{HallNo: "EW 201", CourseCode: "22AI402", RegisterNos: []string{
			"7376232AD174", "7376232AD250", "7376232AD282",
		}},

		// S.No 43 - EW 201 - B.E. EC - 22EC402
		{HallNo: "EW 201", CourseCode: "22EC402", RegisterNos: []string{"7376251EC520", "7376251EC521"}},

		// S.No 44 - EW 201 - B.Tech. IT - 22IT402
		{HallNo: "EW 201", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT106", "7376242IT120")},

		// S.No 45 - EW 201 - B.Tech. AD - 22AI402
		{HallNo: "EW 201", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD102", "7376242AD105")},

		// S.No 46 - EW 202 - B.Tech. IT - 22IT402
		{HallNo: "EW 202", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT136", "7376242IT150")},

		// S.No 47 - EW 202 - B.Tech. AD - 22AI402
		{HallNo: "EW 202", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD116", "7376242AD125")},

		// S.No 48 - EW 203 - B.Tech. IT - 22IT402
		{HallNo: "EW 203", CourseCode: "22IT402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT297", "7376242IT303")...)
			r = append(r, expandRange("7376242IT305", "7376242IT312")...)
			return r
		}()},

		// S.No 49 - EW 203 - B.Tech. AD - 22AI402
		{HallNo: "EW 203", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD242", "7376242AD251")},

		// S.No 50 - EW 204 - B.Tech. IT - 22IT402
		{HallNo: "EW 204", CourseCode: "22IT402", RegisterNos: []string{"7376242IT502"}},

		// S.No 51 - EW 204 - 22IT402
		{HallNo: "EW 204", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT343", "7376242IT351")},

		// S.No 52 - EW 204 - B.Tech. AD - 22AI402
		{HallNo: "EW 204", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD272", "7376242AD281")},

		// S.No 53 - EW 205 - B.E. EE - 22EE402
		{HallNo: "EW 205", CourseCode: "22EE402", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EE111")
			r = append(r, expandRange("7376241EE113", "7376241EE121")...)
			return r
		}()},

		// S.No 54 - EW 205 - B.Tech. AD - 22AI402
		{HallNo: "EW 205", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD302", "7376242AD311")},

		// S.No 55 - EW 206 - B.E. EE - 22EE402
		{HallNo: "EW 206", CourseCode: "22EE402", RegisterNos: expandRange("7376241EE122", "7376241EE146")},

		// S.No 56 - EW 206 - B.Tech. AD - 22AI402
		{HallNo: "EW 206", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD312", "7376242AD336")},

		// S.No 57 - EW 207 - B.E. CS - 22CS402
		{HallNo: "EW 207", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS454", "7376241CS468")},

		// S.No 58 - EW 207 - B.E. EC - 22EC402
		{HallNo: "EW 207", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC335", "7376241EC344")},

		// S.No 59 - EW 208 - 22EC402
		{HallNo: "EW 208", CourseCode: "22EC402", RegisterNos: []string{"7376241EC516"}},

		// S.No 60 - EW 208 - B.E. CS - 22CS402
		{HallNo: "EW 208", CourseCode: "22CS402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS508", "7376251CS513")...)
			r = append(r, expandRange("7376251CS515", "7376251CS523")...)
			return r
		}()},

		// S.No 61 - EW 208 - B.E. EC - 22EC402
		{HallNo: "EW 208", CourseCode: "22EC402", RegisterNos: expandRange("7376251EC501", "7376251EC509")},

		// S.No 62 - EW 209 - B.Tech. IT - 22IT402
		{HallNo: "EW 209", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT121", "7376242IT135")},

		// S.No 63 - EW 209 - B.Tech. AD - 22AI402
		{HallNo: "EW 209", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD106", "7376242AD115")},

		// S.No 64 - EW 210 - B.Tech. IT - 22IT402
		{HallNo: "EW 210", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT167", "7376242IT176")},

		// S.No 65 - EW 210 - B.Tech. AD - 22AI402
		{HallNo: "EW 210", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD137", "7376242AD146")},

		// S.No 66 - EW 211 - B.Tech. IT - 22IT402
		{HallNo: "EW 211", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT232", "7376242IT241")},

		// S.No 67 - EW 211 - B.Tech. AD - 22AI402
		{HallNo: "EW 211", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD187", "7376242AD196")},

		// S.No 68 - EW 212 - B.Tech. IT - 22IT402
		{HallNo: "EW 212", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT242", "7376242IT266")},

		// S.No 69 - EW 212 - B.Tech. AD - 22AI402
		{HallNo: "EW 212", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD197", "7376242AD221")},

		// S.No 70 - EW 213 - B.Tech. BT - 22BT402
		{HallNo: "EW 213", CourseCode: "22BT402", RegisterNos: []string{"7376232BT209"}},

		// S.No 71 - EW 213 - 22BT402
		{HallNo: "EW 213", CourseCode: "22BT402", RegisterNos: expandRange("7376242BT102", "7376242BT115")},

		// S.No 72 - EW 213 - B.Tech. AL - 22AM402
		{HallNo: "EW 213", CourseCode: "22AM402", RegisterNos: expandRange("7376242AL132", "7376242AL141")},

		// S.No 73 - EW 214 - B.Tech. BT - 22BT402
		{HallNo: "EW 214", CourseCode: "22BT402", RegisterNos: expandRange("7376242BT116", "7376242BT130")},

		// S.No 74 - EW 214 - B.Tech. AL - 22AM402
		{HallNo: "EW 214", CourseCode: "22AM402", RegisterNos: expandRange("7376242AL142", "7376242AL151")},

		// S.No 75 - EW 215 - B.Tech. BT - 22BT402
		{HallNo: "EW 215", CourseCode: "22BT402", RegisterNos: expandRange("7376242BT131", "7376242BT145")},

		// S.No 76 - EW 215 - B.Tech. AL - 22AM402
		{HallNo: "EW 215", CourseCode: "22AM402", RegisterNos: expandRange("7376242AL152", "7376242AL161")},

		// S.No 77 - EW 216 - B.Tech. BT - 22BT402
		{HallNo: "EW 216", CourseCode: "22BT402", RegisterNos: expandRange("7376242BT146", "7376242BT155")},

		// S.No 78 - EW 216 - B.Tech. AL - 22AM402
		{HallNo: "EW 216", CourseCode: "22AM402", RegisterNos: expandRange("7376242AL162", "7376242AL171")},

		// S.No 79 - EW 217 - B.Tech. BT - 22BT402
		{HallNo: "EW 217", CourseCode: "22BT402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242BT156", "7376242BT160")...)
			r = append(r, expandRange("7376242BT162", "7376242BT166")...)
			return r
		}()},

		// S.No 80 - EW 217 - B.Tech. AL - 22AM402
		{HallNo: "EW 217", CourseCode: "22AM402", RegisterNos: expandRange("7376242AL172", "7376242AL181")},

		// S.No 81 - EW 218 - B.Tech. BT - 22BT402
		{HallNo: "EW 218", CourseCode: "22BT402", RegisterNos: expandRange("7376242BT167", "7376242BT191")},

		// S.No 82 - EW 218 - B.Tech. AL - 22AM402
		{HallNo: "EW 218", CourseCode: "22AM402", RegisterNos: expandRange("7376242AL182", "7376242AL206")},

		// S.No 83 - MH 301 - B.E. EC - 22EC402
		{HallNo: "MH 301", CourseCode: "22EC402", RegisterNos: []string{
			"7376221EC105", "7376221EC107", "7376221EC116",
			"7376221EC161", "7376221EC192", "7376221EC226",
		}},

		// S.No 84 - MH 301 - B.E. CS - 22CS402
		{HallNo: "MH 301", CourseCode: "22CS402", RegisterNos: []string{
			"7376231CS102", "7376231CS103", "7376231CS190", "7376231CS235",
			"7376231CS244", "7376231CS259", "7376231CS292", "7376231CS346",
		}},

		// S.No 85 - MH 301 - B.E. EC - 22EC402
		{HallNo: "MH 301", CourseCode: "22EC402", RegisterNos: []string{
			"7376231EC110", "7376231EC112", "7376231EC121", "7376231EC196",
		}},

		// S.No 86 - MH 301 - B.E. CS - 22CS402
		{HallNo: "MH 301", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS102", "7376241CS108")},

		// S.No 87 - MH 302 - B.E. EC - 22EC402
		{HallNo: "MH 302", CourseCode: "22EC402", RegisterNos: []string{"7376231EC507", "7376231EC514"}},

		// S.No 88 - MH 302 - 22EC402
		{HallNo: "MH 302", CourseCode: "22EC402", RegisterNos: []string{
			"7376231EC231", "7376231EC283", "7376231EC297",
			"7376231EC305", "7376231EC331", "7376231EC334",
		}},

		// S.No 89 - MH 302 - B.E. CS - 22CS402
		{HallNo: "MH 302", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS109", "7376241CS123")},

		// S.No 90 - MH 302 - B.E. EC - 22EC402
		{HallNo: "MH 302", CourseCode: "22EC402", RegisterNos: []string{"7376241EC103", "7376241EC104"}},

		// S.No 91 - MH 303 - B.E. CS - 22CS402
		{HallNo: "MH 303", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS124", "7376241CS138")},

		// S.No 92 - MH 303 - B.E. EC - 22EC402
		{HallNo: "MH 303", CourseCode: "22EC402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EC105", "7376241EC110")...)
			r = append(r, "7376241EC112", "7376241EC113", "7376241EC115", "7376241EC116")
			return r
		}()},

		// S.No 93 - MH 305 - B.E. CS - 22CS402
		{HallNo: "MH 305", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS139", "7376241CS153")},

		// S.No 94 - MH 305 - B.E. EC - 22EC402
		{HallNo: "MH 305", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC117", "7376241EC126")},

		// S.No 95 - WW 002 - B.Tech. IT - 22IT402
		{HallNo: "WW 002", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT222", "7376242IT231")},

		// S.No 96 - WW 002 - B.Tech. AD - 22AI402
		{HallNo: "WW 002", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD177", "7376242AD186")},

		// S.No 97 - WW 005 - B.Tech. IT - 22IT402
		{HallNo: "WW 005", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT267", "7376242IT281")},

		// S.No 98 - WW 005 - B.Tech. AD - 22AI402
		{HallNo: "WW 005", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD222", "7376242AD231")},

		// S.No 99 - WW 006 - B.Tech. IT - 22IT402
		{HallNo: "WW 006", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT313", "7376242IT327")},

		// S.No 100 - WW 006 - B.Tech. AD - 22AI402
		{HallNo: "WW 006", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD252", "7376242AD261")},

		// S.No 101 - WW 007 - B.Tech. IT - 22IT402
		{HallNo: "WW 007", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT328", "7376242IT342")},

		// S.No 102 - WW 007 - B.Tech. AD - 22AI402
		{HallNo: "WW 007", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD262", "7376242AD271")},

		// S.No 103 - WW 008 - B.Tech. IT - 22IT402
		{HallNo: "WW 008", CourseCode: "22IT402", RegisterNos: []string{"7376242IT506", "7376242IT509"}},

		// S.No 104 - WW 008 - 22IT402
		{HallNo: "WW 008", CourseCode: "22IT402", RegisterNos: expandRange("7376252IT501", "7376252IT513")},

		// S.No 105 - WW 008 - B.Tech. AD - 22AI402
		{HallNo: "WW 008", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD282", "7376242AD291")},

		// S.No 106 - WW 011 - B.Tech. AL - 22AM402
		{HallNo: "WW 011", CourseCode: "22AM402", RegisterNos: []string{
			"7376222AL152", "7376232AL504", "7376232AL510",
		}},

		// S.No 107 - WW 011 - B.E. EE - 22EE402
		{HallNo: "WW 011", CourseCode: "22EE402", RegisterNos: expandRange("7376241EE178", "7376241EE192")},

		// S.No 108 - WW 011 - B.Tech. AD - 22AI402
		{HallNo: "WW 011", CourseCode: "22AI402", RegisterNos: expandRange("7376252AD511", "7376252AD516")},

		// S.No 109 - WW 011 - B.Tech. AL - 22AM402
		{HallNo: "WW 011", CourseCode: "22AM402", RegisterNos: []string{"7376242AL101"}},

		// S.No 110 - WW 012 - B.E. EE - 22EE402
		{HallNo: "WW 012", CourseCode: "22EE402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EE208", "7376241EE217")...)
			r = append(r, expandRange("7376251EE501", "7376251EE505")...)
			return r
		}()},

		// S.No 111 - WW 012 - B.Tech. AL - 22AM402
		{HallNo: "WW 012", CourseCode: "22AM402", RegisterNos: expandRange("7376242AL112", "7376242AL121")},

		// S.No 112 - WW 113 - B.E. CS - 22CS402
		{HallNo: "WW 113", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS201", "7376241CS215")},

		// S.No 113 - WW 113 - B.E. EC - 22EC402
		{HallNo: "WW 113", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC157", "7376241EC166")},

		// S.No 114 - WW 114 - B.E. CS - 22CS402
		{HallNo: "WW 114", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS232", "7376241CS246")},

		// S.No 115 - WW 114 - B.E. EC - 22EC402
		{HallNo: "WW 114", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC178", "7376241EC187")},

		// S.No 116 - WW 115 - B.E. CS - 22CS402
		{HallNo: "WW 115", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS277", "7376241CS291")},

		// S.No 117 - WW 115 - B.E. EC - 22EC402
		{HallNo: "WW 115", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC209", "7376241EC218")},

		// S.No 118 - WW 117 - B.E. CS - 22CS402
		{HallNo: "WW 117", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS307", "7376241CS321")},

		// S.No 119 - WW 117 - B.E. EC - 22EC402
		{HallNo: "WW 117", CourseCode: "22EC402", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EC229", "7376241EC230")
			r = append(r, expandRange("7376241EC231", "7376241EC239")...) 
			return r
		}()},
		// S.No 120 - WW 118 - B.E. CS - 22CS402
		{HallNo: "WW 118", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS383", "7376241CS397")},

		// S.No 121 - WW 118 - B.E. EC - 22EC402
		{HallNo: "WW 118", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC280", "7376241EC289")},

		// S.No 122 - WW 202 - B.E. CS - 22CS402
		{HallNo: "WW 202", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS398", "7376241CS422")},

		// S.No 123 - WW 202 - B.E. EC - 22EC402
		{HallNo: "WW 202", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC290", "7376241EC314")},

		// S.No 124 - WW 203 - B.E. CS - 22CS402
		{HallNo: "WW 203", CourseCode: "22CS402", RegisterNos: expandRange("7376241CS423", "7376241CS437")},

		// S.No 125 - WW 203 - B.E. EC - 22EC402
		{HallNo: "WW 203", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC315", "7376241EC324")},

		// S.No 126 - WW 204 - B.Tech. IT - 22IT402
		{HallNo: "WW 204", CourseCode: "22IT402", RegisterNos: []string{"7376212IT105"}},

		// S.No 127 - WW 204 - 22IT402
		{HallNo: "WW 204", CourseCode: "22IT402", RegisterNos: []string{"7376222IT110"}},

		// S.No 128 - WW 204 - 22IT402
		{HallNo: "WW 204", CourseCode: "22IT402", RegisterNos: []string{
			"7376232IT113", "7376232IT118", "7376232IT122", "7376232IT146",
			"7376232IT152", "7376232IT228", "7376232IT282",
		}},

		// S.No 129 - WW 204 - B.E. CS - 22CS402
		{HallNo: "WW 204", CourseCode: "22CS402", RegisterNos: []string{"7376251CS524"}},

		// S.No 130 - WW 204 - B.E. EC - 22EC402
		{HallNo: "WW 204", CourseCode: "22EC402", RegisterNos: expandRange("7376251EC510", "7376251EC519")},

		// S.No 131 - WW 204 - B.Tech. IT - 22IT402
		{HallNo: "WW 204", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT101", "7376242IT105")},

		// S.No 132 - WW 205 - 22IT402
		{HallNo: "WW 205", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT177", "7376242IT191")},

		// S.No 133 - WW 205 - B.Tech. AD - 22AI402
		{HallNo: "WW 205", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD147", "7376242AD156")},

		// S.No 134 - WW 211 - B.E. CS - 22CS402
		{HallNo: "WW 211", CourseCode: "22CS402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS438", "7376241CS442")...)
			r = append(r, expandRange("7376241CS444", "7376241CS453")...)
			return r
		}()},

		// S.No 135 - WW 211 - B.E. EC - 22EC402
		{HallNo: "WW 211", CourseCode: "22EC402", RegisterNos: expandRange("7376241EC325", "7376241EC334")},

		// S.No 136 - WW 212 - B.E. CD - 22CD402
		{HallNo: "WW 212", CourseCode: "22CD402", RegisterNos: []string{
			"7376221CD114", "7376221CD126", "7376221CD144", "7376221CD153",
			"7376231CD503",
		}},

		// S.No 137 - WW 212 - B.Tech. TT - 22TT402
		{HallNo: "WW 212", CourseCode: "22TT402", RegisterNos: []string{"7376232TX515"}},

		// S.No 138 - WW 212 - B.E. BM - 22BM402
		{HallNo: "WW 212", CourseCode: "22BM402", RegisterNos: []string{
			"7376231BM107", "7376231BM148", "7376241BM501",
		}},

		// S.No 139 - WW 212 - B.E. CD - 22CD402
		{HallNo: "WW 212", CourseCode: "22CD402", RegisterNos: []string{
			"7376231CD107", "7376231CD111", "7376231CD115", "7376231CD143",
			"7376241CD501", "7376241CD502",
		}},

		// S.No 140 - WW 212 - B.Tech. CT - 22CT402
		{HallNo: "WW 212", CourseCode: "22CT402", RegisterNos: []string{"7376232CT122", "7376242CT503"}},

		// S.No 141 - WW 212 - B.Tech. AG - 22AG402
		{HallNo: "WW 212", CourseCode: "22AG402", RegisterNos: []string{"7376242AG501"}},

		// S.No 142 - WW 212 - 22AG402
		{HallNo: "WW 212", CourseCode: "22AG402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AG106", "7376242AG124")...)
			r = append(r, "7376252AG501", "7376252AG502")
			return r
		}()},

		// S.No 143 - WW 213 - B.Tech. IT - 22IT402
		{HallNo: "WW 213", CourseCode: "22IT402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT151", "7376242IT153")...)
			r = append(r, expandRange("7376242IT155", "7376242IT166")...)
			return r
		}()},

		// S.No 144 - WW 213 - B.Tech. AD - 22AI402
		{HallNo: "WW 213", CourseCode: "22AI402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AD126", "7376242AD129")...)
			r = append(r, expandRange("7376242AD131", "7376242AD136")...)
			return r
		}()},

		// S.No 145 - WW 214 - B.Tech. IT - 22IT402
		{HallNo: "WW 214", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT192", "7376242IT206")},

		// S.No 146 - WW 214 - B.Tech. AD - 22AI402
		{HallNo: "WW 214", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD157", "7376242AD166")},

		// S.No 147 - WW 215 - B.Tech. IT - 22IT402
		{HallNo: "WW 215", CourseCode: "22IT402", RegisterNos: expandRange("7376242IT207", "7376242IT221")},

		// S.No 148 - WW 215 - B.Tech. AD - 22AI402
		{HallNo: "WW 215", CourseCode: "22AI402", RegisterNos: expandRange("7376242AD167", "7376242AD176")},

		// S.No 149 - WW 218 - B.Tech. BT - 22BT402
		{HallNo: "WW 218", CourseCode: "22BT402", RegisterNos: expandRange("7376242BT192", "7376242BT206")},

		// S.No 150 - WW 218 - B.Tech. AL - 22AM402
		{HallNo: "WW 218", CourseCode: "22AM402", RegisterNos: expandRange("7376242AL207", "7376242AL216")},

		// S.No 151 - WW 219 - 22AM402
		{HallNo: "WW 219", CourseCode: "22AM402", RegisterNos: []string{"7376242AL501", "7376242AL503"}},

		// S.No 152 - WW 219 - B.Tech. BT - 22BT402
		{HallNo: "WW 219", CourseCode: "22BT402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242BT207", "7376242BT218")...)
			r = append(r, expandRange("7376242BT220", "7376242BT222")...)
			return r
		}()},

		// S.No 153 - WW 219 - B.Tech. AL - 22AM402
		{HallNo: "WW 219", CourseCode: "22AM402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AL217", "7376242AL223")...)
			r = append(r, "7376252AL501")
			return r
		}()},

		// S.No 154 - WW 222 - B.Tech. CB - 22CB402
		{HallNo: "WW 222", CourseCode: "22CB402", RegisterNos: []string{"7376222CB121"}},

		// S.No 155 - WW 222 - B.E. MZ - 22MC402
		{HallNo: "WW 222", CourseCode: "22MC402", RegisterNos: []string{"7376231MZ106", "7376231MZ111"}},

		// S.No 156 - WW 222 - B.Tech. CB - 22CB402
		{HallNo: "WW 222", CourseCode: "22CB402", RegisterNos: []string{
			"7376232CB106", "7376232CB111", "7376232CB123", "7376232CB133",
		}},

		// S.No 157 - WW 222 - B.E. MZ - 22MC402
		{HallNo: "WW 222", CourseCode: "22MC402", RegisterNos: expandRange("7376241MZ101", "7376241MZ121")},

		// S.No 158 - WW 222 - B.Tech. BT - 22BT402
		{HallNo: "WW 222", CourseCode: "22BT402", RegisterNos: []string{"7376252BT501"}},

		// S.No 159 - WW 222 - B.Tech. CB - 22CB402
		{HallNo: "WW 222", CourseCode: "22CB402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242CB102", "7376242CB105")...)
			r = append(r, expandRange("7376242CB107", "7376242CB121")...)
			return r
		}()},

		// S.No 160 - WW 222 - B.Tech. AL - 22AM402
		{HallNo: "WW 222", CourseCode: "22AM402", RegisterNos: []string{"7376252AL502", "7376252AL503"}},

		// S.No 161 - WW 223 - B.E. MZ - 22MC402
		{HallNo: "WW 223", CourseCode: "22MC402", RegisterNos: expandRange("7376241MZ122", "7376241MZ146")},

		// S.No 162 - WW 223 - B.Tech. CB - 22CB402
		{HallNo: "WW 223", CourseCode: "22CB402", RegisterNos: expandRange("7376242CB122", "7376242CB146")},

		// S.No 163 - WW 224 - B.E. ME - 22ME402
		{HallNo: "WW 224", CourseCode: "22ME402", RegisterNos: []string{"201ME153"}},

		// S.No 164 - WW 224 - B.E. EI - 22EI402
		{HallNo: "WW 224", CourseCode: "22EI402", RegisterNos: []string{"7376231EI143", "7376231EI159"}},

		// S.No 165 - WW 224 - B.E. MZ - 22MC402
		{HallNo: "WW 224", CourseCode: "22MC402", RegisterNos: []string{"7376241MZ501"}},

		// S.No 166 - WW 224 - B.Tech. CB - 22CB402
		{HallNo: "WW 224", CourseCode: "22CB402", RegisterNos: []string{"7376242CB502"}},

		// S.No 167 - WW 224 - B.E. EI - 22EI402
		{HallNo: "WW 224", CourseCode: "22EI402", RegisterNos: expandRange("7376241EI101", "7376241EI106")},

		// S.No 168 - WW 224 - B.E. ME - 22ME402
		{HallNo: "WW 224", CourseCode: "22ME402", RegisterNos: expandRange("7376241ME102", "7376241ME104")},

		// S.No 169 - WW 224 - B.E. MZ - 22MC402
		{HallNo: "WW 224", CourseCode: "22MC402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241MZ147", "7376241MZ160")...)
			r = append(r, expandRange("7376251MZ501", "7376251MZ506")...)
			return r
		}()},

		// S.No 170 - WW 224 - B.Tech. CB - 22CB402
		{HallNo: "WW 224", CourseCode: "22CB402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242CB147", "7376242CB159")...)
			r = append(r, expandRange("7376252CB501", "7376252CB503")...)
			return r
		}()},

		// S.No 171 - WW 225 - B.E. EI - 22EI402
		{HallNo: "WW 225", CourseCode: "22EI402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EI107", "7376241EI125")...)
			r = append(r, expandRange("7376241EI127", "7376241EI132")...)
			return r
		}()},

		// S.No 172 - WW 225 - B.E. ME - 22ME402
		{HallNo: "WW 225", CourseCode: "22ME402", RegisterNos: expandRange("7376241ME105", "7376241ME129")},

		// S.No 173 - WW 226 - B.E. EI - 22EI402
		{HallNo: "WW 226", CourseCode: "22EI402", RegisterNos: expandRange("7376241EI133", "7376241EI157")},

		// S.No 174 - WW 226 - B.E. ME - 22ME402
		{HallNo: "WW 226", CourseCode: "22ME402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241ME130", "7376241ME132")...)
			r = append(r, expandRange("7376241ME134", "7376241ME155")...)
			return r
		}()},

		// S.No 175 - WW 227 - B.E. CE - 22CE402
		{HallNo: "WW 227", CourseCode: "22CE402", RegisterNos: []string{
			"7376221CE112", "7376221CE123", "7376221CE124", "7376221CE138",
			"7376231CE503",
		}},

		// S.No 176 - WW 227 - B.E. MC - 22MC402
		{HallNo: "WW 227", CourseCode: "22MC402", RegisterNos: []string{"7376231MC506"}},

		// S.No 177 - WW 227 - B.E. SE - 22IS402
		{HallNo: "WW 227", CourseCode: "22IS402", RegisterNos: []string{
			"7376221SE108", "7376221SE134", "7376221SE140",
		}},

		// S.No 178 - WW 227 - B.Tech. FD - 22FD402
		{HallNo: "WW 227", CourseCode: "22FD402", RegisterNos: []string{
			"7376222FD107", "7376222FD121", "7376222FD125",
		}},

		// S.No 179 - WW 227 - B.Tech. AG - 22AG402
		{HallNo: "WW 227", CourseCode: "22AG402", RegisterNos: []string{
			"7376222AG116", "7376222AG120", "7376222AG157", "7376222AG158",
		}},

		// S.No 180 - WW 227 - B.E. CE - 22CE402
		{HallNo: "WW 227", CourseCode: "22CE402", RegisterNos: []string{
			"7376231CE104", "7376231CE108", "7376231CE113", "7376231CE117",
			"7376231CE120", "7376231CE129", "7376241CE501",
		}},

		// S.No 181 - WW 227 - B.E. SE - 22IS402
		{HallNo: "WW 227", CourseCode: "22IS402", RegisterNos: []string{"7376231SE137"}},

		// S.No 182 - WW 227 - B.Tech. AG - 22AG402
		{HallNo: "WW 227", CourseCode: "22AG402", RegisterNos: []string{
			"7376232AG113", "7376232AG129", "7376232AG132", "7376232AG151",
		}},

		// S.No 183 - WW 227 - B.E. EI - 22EI402
		{HallNo: "WW 227", CourseCode: "22EI402", RegisterNos: []string{
			"7376241EI158", "7376241EI159", "7376241EI160",
			"7376251EI501", "7376251EI502",
		}},

		// S.No 184 - WW 227 - B.E. ME - 22ME402
		{HallNo: "WW 227", CourseCode: "22ME402", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241ME156", "7376241ME159")...)
			r = append(r, expandRange("7376251ME501", "7376251ME508")...)
			return r
		}()},

		// S.No 185 - WW 227 - B.Tech. AG - 22AG402
		{HallNo: "WW 227", CourseCode: "22AG402", RegisterNos: expandRange("7376242AG101", "7376242AG105")},
	}
}

func buildSeatingDataSession12AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		{HallNo: "EW 101", CourseCode: "22EC304", RegisterNos: []string{
			"7376221EC102",
			"7376221EC107",
			"7376221EC151",
			"7376221EC192",
			"7376221EC226",
			"7376221EC290",
			"7376221EC337",
			"7376231EC101",
			"7376231EC110",
			"7376231EC112",
			"7376231EC121",
			"7376231EC283",
			"7376231EC297",
			"7376231EC305",
			"7376231EC331",
		}},

		{HallNo: "EW 101", CourseCode: "22IT304", RegisterNos: []string{
			"7376222IT110",
			"7376232IT118",
			"7376232IT152",
			"7376232IT282",
			"7376242IT164",
			"7376242IT184",
			"7376242IT214",
			"7376242IT227",
			"7376242IT287",
			"7376252IT506",
		}},

		{HallNo: "EW 102", CourseCode: "22EC304", RegisterNos: []string{
			"7376231EC514",
			"7376231EC334",
			"7376241EC133",
			"7376241EC137",
			"7376241EC144",
			"7376241EC147",
			"7376241EC151",
			"7376241EC160",
			"7376241EC163",
			"7376241EC170",
			"7376241EC246",
			"7376241EC256",
			"7376241EC271",
			"7376241EC279",
			"7376241EC284",
		}},

		{HallNo: "EW 102", CourseCode: "22EE304", RegisterNos: []string{
			"7376241EE130",
			"7376241EE146",
			"7376241EE147",
			"7376241EE157",
			"7376241EE190",
			"7376241EE193",
			"7376251EE502",
		}},

		{HallNo: "EW 102", CourseCode: "22IT304", RegisterNos: []string{
			"7376252IT507",
			"7376252IT511",
			"7376252IT513",
		}},

		{HallNo: "EW 103", CourseCode: "22ME304", RegisterNos: []string{
			"7376221ME111",
			"7376221ME114",
			"7376221ME154",
			"7376231ME121",
			"7376231ME149",
			"7376241ME102",
		}},

		{HallNo: "EW 103", CourseCode: "22EC304", RegisterNos: []string{
			"7376241EC504",
			"7376241EC513",
			"7376241EC515",
			"7376241EC312",
			"7376241EC328",
			"7376241EC334",
			"7376241EC339",
			"7376251EC505",
			"7376251EC506",
			"7376251EC507",
			"7376251EC509",
			"7376251EC511",
			"7376251EC513",
			"7376251EC516",
			"7376251EC519",
		}},

		{HallNo: "EW 103", CourseCode: "22EE304", RegisterNos: []string{
			"7376251EE504",
			"7376251EE506",
			"7376251EE507",
			"7376251EE510",
		}},

		{HallNo: "EW 104", CourseCode: "22CS304", RegisterNos: []string{
			"7376221CS118",
			"7376221CS240",
			"7376221CS275",
			"7376231CS102",
			"7376231CS103",
			"7376231CS190",
			"7376231CS235",
			"7376231CS244",
			"7376231CS259",
			"7376241CS395",
			"7376251CS522",
		}},

		{HallNo: "EW 104", CourseCode: "22CB304", RegisterNos: []string{
			"7376232CB501",
			"7376232CB111",
			"7376232CB123",
			"7376232CB133",
			"7376242CB502",
			"7376242CB116",
			"7376242CB119",
		}},

		{HallNo: "EW 104", CourseCode: "22MC304", RegisterNos: []string{
			"7376231MZ106",
			"7376231MZ111",
			"7376231MZ135",
			"7376241MZ124",
		}},

		{HallNo: "EW 105", CourseCode: "22CE304", RegisterNos: []string{
			"7376221CE124",
			"7376231CE120",
			"7376241CE501",
		}},

		{HallNo: "EW 105", CourseCode: "22AI304", RegisterNos: []string{
			"7376232AD502",
			"7376232AD250",
			"7376242AD137",
			"7376242AD189",
			"7376242AD190",
			"7376242AD320",
			"7376252AD502",
			"7376252AD510",
		}},

		{HallNo: "EW 105", CourseCode: "22AG304", RegisterNos: []string{
			"7376222AG116",
			"7376232AG502",
			"7376232AG151",
			"7376252AG502",
		}},

		{HallNo: "EW 105", CourseCode: "22EI304", RegisterNos: []string{
			"7376241EI104",
		}},

		{HallNo: "EW 105", CourseCode: "22MC304", RegisterNos: []string{
			"7376241MZ127",
			"7376241MZ139",
			"7376241MZ143",
			"7376251MZ504",
			"7376251MZ505",
			"7376251MZ506",
		}},

		{HallNo: "EW 105", CourseCode: "22BT304", RegisterNos: []string{
			"7376242BT113",
		}},

		{HallNo: "EW 105", CourseCode: "22AM304", RegisterNos: []string{
			"7376242AL157",
			"7376242AL207",
		}},

		{HallNo: "EW 106", CourseCode: "22MC304", RegisterNos: []string{
			"7376231MC507",
		}},

		{HallNo: "EW 106", CourseCode: "22IS304", RegisterNos: []string{
			"7376221SE134",
			"7376221SE140",
			"7376231SE144",
		}},

		{HallNo: "EW 106", CourseCode: "22CD304", RegisterNos: []string{
			"7376221CD114",
			"7376221CD144",
			"7376241CD501",
		}},

		{HallNo: "EW 106", CourseCode: "22FD304", RegisterNos: []string{
			"7376222FD107",
			"7376222FD125",
		}},

		{HallNo: "EW 106", CourseCode: "22BM304", RegisterNos: []string{
			"7376231BM107",
			"7376241BM501",
		}},

		{HallNo: "EW 106", CourseCode: "22EI304", RegisterNos: []string{
			"7376251EI502",
		}},

		{HallNo: "EW 106", CourseCode: "22BT304", RegisterNos: []string{
			"7376242BT120",
			"7376242BT138",
			"7376242BT151",
			"7376242BT156",
			"7376252BT501",
		}},
	}
}
// buildSeatingData13FN returns all seating records from the 13-05-2026 FN exam
// Exam Date: 13-05-2026 | Session: FN - 09:00 AM to 12:00 PM
func buildSeatingData13FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - AE 302 - B.E. CS - 22CS602
		{HallNo: "AE 302", CourseCode: "22CS602", RegisterNos: expandRange("7376231CS149", "7376231CS163")},

		// S.No 2 - AE 302 - B.E. EC - 22EC602
		{HallNo: "AE 302", CourseCode: "22EC602", RegisterNos: expandRange("7376231EC137", "7376231EC146")},

		// S.No 3 - EW 101 - B.E. CS - 22CS602
		{HallNo: "EW 101", CourseCode: "22CS602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS164", "7376231CS166")...)
			r = append(r, expandRange("7376231CS168", "7376231CS179")...)
			return r
		}()},

		// S.No 4 - EW 101 - B.E. EC - 22EC602
		{HallNo: "EW 101", CourseCode: "22EC602", RegisterNos: expandRange("7376231EC147", "7376231EC156")},

		// S.No 5 - EW 102 - B.E. CS - 22CS602
		{HallNo: "EW 102", CourseCode: "22CS602", RegisterNos: expandRange("7376231CS180", "7376231CS194")},

		// S.No 6 - EW 102 - B.E. EC - 22EC602
		{HallNo: "EW 102", CourseCode: "22EC602", RegisterNos: expandRange("7376231EC157", "7376231EC166")},

		// S.No 7 - EW 103 - B.E. CS - 22CS602
		{HallNo: "EW 103", CourseCode: "22CS602", RegisterNos: expandRange("7376231CS240", "7376231CS254")},

		// S.No 8 - EW 103 - B.E. EC - 22EC602
		{HallNo: "EW 103", CourseCode: "22EC602", RegisterNos: expandRange("7376231EC197", "7376231EC206")},

		// S.No 9 - EW 104 - B.E. CS - 22CS602
		{HallNo: "EW 104", CourseCode: "22CS602", RegisterNos: expandRange("7376231CS333", "7376231CS347")},

		// S.No 10 - EW 104 - B.E. EC - 22EC602
		{HallNo: "EW 104", CourseCode: "22EC602", RegisterNos: expandRange("7376231EC257", "7376231EC266")},

		// S.No 11 - EW 105 - B.E. CS - 22CS602
		{HallNo: "EW 105", CourseCode: "22CS602", RegisterNos: []string{"7376231CS512"}},

		// S.No 12 - EW 105 - 22CS602
		{HallNo: "EW 105", CourseCode: "22CS602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS348", "7376231CS354")...)
			r = append(r, expandRange("7376241CS501", "7376241CS507")...)
			return r
		}()},

		// S.No 13 - EW 105 - B.E. EC - 22EC602
		{HallNo: "EW 105", CourseCode: "22EC602", RegisterNos: expandRange("7376231EC267", "7376231EC276")},

		// S.No 14 - EW 106 - B.Tech. IT - 22IT602
		{HallNo: "EW 106", CourseCode: "22IT602", RegisterNos: []string{"7376222IT110", "7376222IT217", "7376222IT235"}},

		// S.No 15 - EW 106 - B.E. EC - 22EC602
		{HallNo: "EW 106", CourseCode: "22EC602", RegisterNos: expandRange("7376241EC517", "7376241EC522")},

		// S.No 16 - EW 106 - B.Tech. IT - 22IT602
		{HallNo: "EW 106", CourseCode: "22IT602", RegisterNos: []string{"7376232IT101"}},

		// S.No 17 - EW 106 - B.Tech. AD - 22AI602
		{HallNo: "EW 106", CourseCode: "22AI602", RegisterNos: expandRange("7376232AD190", "7376232AD204")},

		// S.No 18 - EW 107 - B.E. CS - 22CS602
		{HallNo: "EW 107", CourseCode: "22CS602", RegisterNos: expandRange("7376231CS210", "7376231CS224")},

		// S.No 19 - EW 107 - B.E. EC - 22EC602
		{HallNo: "EW 107", CourseCode: "22EC602", RegisterNos: expandRange("7376231EC177", "7376231EC186")},

		// S.No 20 - EW 108 - B.E. CS - 22CS602
		{HallNo: "EW 108", CourseCode: "22CS602", RegisterNos: expandRange("7376231CS255", "7376231CS269")},

		// S.No 21 - EW 108 - B.E. EC - 22EC602
		{HallNo: "EW 108", CourseCode: "22EC602", RegisterNos: expandRange("7376231EC207", "7376231EC216")},

		// S.No 22 - EW 109 - B.E. CS - 22CS602
		{HallNo: "EW 109", CourseCode: "22CS602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS285", "7376231CS287")...)
			r = append(r, expandRange("7376231CS289", "7376231CS300")...)
			return r
		}()},

		// S.No 23 - EW 109 - B.E. EC - 22EC602
		{HallNo: "EW 109", CourseCode: "22EC602", RegisterNos: expandRange("7376231EC227", "7376231EC236")},

		// S.No 24 - EW 111 - B.E. CS - 22CS602
		{HallNo: "EW 111", CourseCode: "22CS602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS316", "7376231CS321")...)
			r = append(r, expandRange("7376231CS323", "7376231CS326")...)
			r = append(r, expandRange("7376231CS328", "7376231CS332")...)
			return r
		}()},

		// S.No 25 - EW 111 - B.E. EC - 22EC602
		{HallNo: "EW 111", CourseCode: "22EC602", RegisterNos: expandRange("7376231EC247", "7376231EC256")},

		// S.No 26 - EW 112 - B.E. CS - 22CS602
		{HallNo: "EW 112", CourseCode: "22CS602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS508", "7376241CS516")...)
			r = append(r, "7376241CS518", "7376241CS519")
			return r
		}()},

		// S.No 27 - EW 112 - B.E. EC - 22EC602
		{HallNo: "EW 112", CourseCode: "22EC602", RegisterNos: expandRange("7376231EC277", "7376231EC286")},

		// S.No 28 - EW 112 - B.Tech. AD - 22AI602
		{HallNo: "EW 112", CourseCode: "22AI602", RegisterNos: expandRange("7376232AD101", "7376232AD104")},

		// S.No 29 - EW 113 - B.Tech. IT - 22IT602
		{HallNo: "EW 113", CourseCode: "22IT602", RegisterNos: expandRange("7376232IT249", "7376232IT258")},

		// S.No 30 - EW 113 - B.Tech. AL - 22AM602
		{HallNo: "EW 113", CourseCode: "22AM602", RegisterNos: expandRange("7376232AL203", "7376232AL217")},

		// S.No 31 - EW 114 - B.Tech. CB - 22CB602
		{HallNo: "EW 114", CourseCode: "22CB602", RegisterNos: []string{"7376222CB121"}},

		// S.No 32 - EW 114 - B.E. ME - 22ME602
		{HallNo: "EW 114", CourseCode: "22ME602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231ME157", "7376231ME161")...)
			r = append(r, expandRange("7376241ME501", "7376241ME505")...)
			return r
		}()},

		// S.No 33 - EW 114 - B.Tech. BT - 22BT602
		{HallNo: "EW 114", CourseCode: "22BT602", RegisterNos: expandRange("7376232BT111", "7376232BT120")},

		// S.No 34 - EW 114 - B.Tech. CB - 22CB602
		{HallNo: "EW 114", CourseCode: "22CB602", RegisterNos: expandRange("7376232CB101", "7376232CB104")},

		// S.No 35 - EW 115 - B.Tech. BT - 22BT602
		{HallNo: "EW 115", CourseCode: "22BT602", RegisterNos: expandRange("7376232BT158", "7376232BT167")},

		// S.No 36 - EW 115 - B.Tech. CB - 22CB602
		{HallNo: "EW 115", CourseCode: "22CB602", RegisterNos: expandRange("7376232CB141", "7376232CB155")},

		// S.No 37 - EW 116 - 22CB602
		{HallNo: "EW 116", CourseCode: "22CB602", RegisterNos: []string{"7376232CB501", "7376232CB504"}},

		// S.No 38 - EW 116 - B.E. EI - 22EI602
		{HallNo: "EW 116", CourseCode: "22EI602", RegisterNos: expandRange("7376231EI101", "7376231EI104")},

		// S.No 39 - EW 116 - B.Tech. BT - 22BT602
		{HallNo: "EW 116", CourseCode: "22BT602", RegisterNos: expandRange("7376232BT168", "7376232BT177")},

		// S.No 40 - EW 116 - B.Tech. CB - 22CB602
		{HallNo: "EW 116", CourseCode: "22CB602", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232CB156", "7376232CB157")
			r = append(r, expandRange("7376232CB159", "7376232CB163")...)
			r = append(r, "7376242CB502", "7376242CB503")
			return r
		}()},

		// S.No 41 - EW 117 - B.E. EI - 22EI602
		{HallNo: "EW 117", CourseCode: "22EI602", RegisterNos: expandRange("7376231EI120", "7376231EI134")},

		// S.No 42 - EW 117 - B.Tech. BT - 22BT602
		{HallNo: "EW 117", CourseCode: "22BT602", RegisterNos: expandRange("7376232BT189", "7376232BT198")},

		// S.No 43 - EW 118 - B.E. EI - 22EI602
		{HallNo: "EW 118", CourseCode: "22EI602", RegisterNos: []string{"7376231EI501", "7376231EI503"}},

		// S.No 44 - EW 118 - B.E. CD - 22CD602
		{HallNo: "EW 118", CourseCode: "22CD602", RegisterNos: []string{"7376221CD114", "7376221CD126", "7376221CD153"}},

		// S.No 45 - EW 118 - B.E. EI - 22EI602
		{HallNo: "EW 118", CourseCode: "22EI602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EI150", "7376231EI160")...)
			r = append(r, "7376241EI501", "7376241EI502")
			return r
		}()},

		// S.No 46 - EW 118 - B.Tech. BT - 22BT602
		{HallNo: "EW 118", CourseCode: "22BT602", RegisterNos: expandRange("7376232BT209", "7376232BT215")},

		// S.No 47 - EW 201 - B.Tech. IT - 22IT602
		{HallNo: "EW 201", CourseCode: "22IT602", RegisterNos: expandRange("7376232IT122", "7376232IT131")},

		// S.No 48 - EW 201 - B.Tech. AD - 22AI602
		{HallNo: "EW 201", CourseCode: "22AI602", RegisterNos: expandRange("7376232AD235", "7376232AD249")},

		// S.No 49 - EW 202 - B.Tech. IT - 22IT602
		{HallNo: "EW 202", CourseCode: "22IT602", RegisterNos: expandRange("7376232IT142", "7376232IT151")},

		// S.No 50 - EW 202 - B.Tech. AD - 22AI602
		{HallNo: "EW 202", CourseCode: "22AI602", RegisterNos: expandRange("7376232AD265", "7376232AD279")},

		// S.No 51 - EW 203 - B.E. ME - 22ME602
		{HallNo: "EW 203", CourseCode: "22ME602", RegisterNos: []string{"7376221ME111", "7376221ME138", "7376221ME154"}},

		// S.No 52 - EW 203 - 22ME602
		{HallNo: "EW 203", CourseCode: "22ME602", RegisterNos: []string{"7376231ME101"}},

		// S.No 53 - EW 203 - B.Tech. IT - 22IT602
		{HallNo: "EW 203", CourseCode: "22IT602", RegisterNos: expandRange("7376232IT259", "7376232IT268")},

		// S.No 54 - EW 203 - B.Tech. AL - 22AM602
		{HallNo: "EW 203", CourseCode: "22AM602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AL218", "7376232AL221")...)
			r = append(r, expandRange("7376242AL501", "7376242AL507")...)
			return r
		}()},

		// S.No 55 - EW 204 - B.Tech. BT - 22BT602
		{HallNo: "EW 204", CourseCode: "22BT602", RegisterNos: []string{"7376222BT110", "7376222BT152"}},

		// S.No 56 - EW 204 - B.E. ME - 22ME602
		{HallNo: "EW 204", CourseCode: "22ME602", RegisterNos: expandRange("7376231ME132", "7376231ME141")},

		// S.No 57 - EW 204 - B.Tech. IT - 22IT602
		{HallNo: "EW 204", CourseCode: "22IT602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT503", "7376242IT505")...)
			r = append(r, expandRange("7376242IT507", "7376242IT511")...)
			return r
		}()},

		// S.No 58 - EW 205 - B.Tech. BT - 22BT602
		{HallNo: "EW 205", CourseCode: "22BT602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232BT121", "7376232BT127")...)
			r = append(r, expandRange("7376232BT129", "7376232BT131")...)
			return r
		}()},

		// S.No 59 - EW 205 - B.Tech. CB - 22CB602
		{HallNo: "EW 205", CourseCode: "22CB602", RegisterNos: expandRange("7376232CB105", "7376232CB114")},

		// S.No 60 - EW 206 - B.Tech. BT - 22BT602
		{HallNo: "EW 206", CourseCode: "22BT602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232BT132", "7376232BT149")...)
			r = append(r, expandRange("7376232BT151", "7376232BT157")...)
			return r
		}()},

		// S.No 61 - EW 206 - B.Tech. CB - 22CB602
		{HallNo: "EW 206", CourseCode: "22CB602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232CB115", "7376232CB137")...)
			r = append(r, "7376232CB139", "7376232CB140")
			return r
		}()},

		// S.No 62 - EW 207 - B.E. EC - 22EC602
		{HallNo: "EW 207", CourseCode: "22EC602", RegisterNos: expandRange("7376241EC507", "7376241EC516")},

		// S.No 63 - EW 207 - B.Tech. AD - 22AI602
		{HallNo: "EW 207", CourseCode: "22AI602", RegisterNos: expandRange("7376232AD175", "7376232AD189")},

		// S.No 64 - EW 208 - B.Tech. IT - 22IT602
		{HallNo: "EW 208", CourseCode: "22IT602", RegisterNos: expandRange("7376232IT102", "7376232IT111")},

		// S.No 65 - EW 208 - B.Tech. AD - 22AI602
		{HallNo: "EW 208", CourseCode: "22AI602", RegisterNos: expandRange("7376232AD205", "7376232AD219")},

		// S.No 66 - EW 209 - B.Tech. IT - 22IT602
		{HallNo: "EW 209", CourseCode: "22IT602", RegisterNos: expandRange("7376232IT132", "7376232IT141")},

		// S.No 67 - EW 209 - B.Tech. AD - 22AI602
		{HallNo: "EW 209", CourseCode: "22AI602", RegisterNos: expandRange("7376232AD250", "7376232AD264")},

		// S.No 68 - EW 210 - B.Tech. AL - 22AM602
		{HallNo: "EW 210", CourseCode: "22AM602", RegisterNos: []string{"7376222AL121"}},

		// S.No 69 - EW 210 - B.Tech. IT - 22IT602
		{HallNo: "EW 210", CourseCode: "22IT602", RegisterNos: expandRange("7376232IT163", "7376232IT172")},

		// S.No 70 - EW 210 - B.Tech. AD - 22AI602
		{HallNo: "EW 210", CourseCode: "22AI602", RegisterNos: expandRange("7376242AD508", "7376242AD510")},

		// S.No 71 - EW 210 - B.Tech. AL - 22AM602
		{HallNo: "EW 210", CourseCode: "22AM602", RegisterNos: expandRange("7376232AL101", "7376232AL106")},

		// S.No 72 - EW 211 - B.Tech. IT - 22IT602
		{HallNo: "EW 211", CourseCode: "22IT602", RegisterNos: expandRange("7376232IT203", "7376232IT212")},

		// S.No 73 - EW 211 - B.Tech. AL - 22AM602
		{HallNo: "EW 211", CourseCode: "22AM602", RegisterNos: expandRange("7376232AL152", "7376232AL161")},

		// S.No 74 - EW 212 - B.Tech. IT - 22IT602
		{HallNo: "EW 212", CourseCode: "22IT602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232IT213", "7376232IT226")...)
			r = append(r, expandRange("7376232IT228", "7376232IT238")...)
			return r
		}()},

		// S.No 75 - EW 212 - B.Tech. AL - 22AM602
		{HallNo: "EW 212", CourseCode: "22AM602", RegisterNos: expandRange("7376232AL162", "7376232AL186")},

		// S.No 76 - EW 213 - B.E. EI - 22EI602
		{HallNo: "EW 213", CourseCode: "22EI602", RegisterNos: []string{"7376241EI503", "7376241EI504"}},

		// S.No 77 - EW 213 - B.E. CD - 22CD602
		{HallNo: "EW 213", CourseCode: "22CD602", RegisterNos: expandRange("7376231CD102", "7376231CD111")},

		// S.No 78 - EW 213 - B.E. MZ - 22MC602
		{HallNo: "EW 213", CourseCode: "22MC602", RegisterNos: expandRange("7376231MZ101", "7376231MZ113")},

		// S.No 79 - EW 214 - B.E. CD - 22CD602
		{HallNo: "EW 214", CourseCode: "22CD602", RegisterNos: expandRange("7376231CD112", "7376231CD121")},

		// S.No 80 - EW 214 - B.E. MZ - 22MC602
		{HallNo: "EW 214", CourseCode: "22MC602", RegisterNos: expandRange("7376231MZ114", "7376231MZ128")},

		// S.No 81 - EW 215 - B.E. CD - 22CD602
		{HallNo: "EW 215", CourseCode: "22CD602", RegisterNos: expandRange("7376231CD122", "7376231CD131")},

		// S.No 82 - EW 215 - B.E. MZ - 22MC602
		{HallNo: "EW 215", CourseCode: "22MC602", RegisterNos: expandRange("7376231MZ129", "7376231MZ143")},

		// S.No 83 - EW 216 - B.E. CD - 22CD602
		{HallNo: "EW 216", CourseCode: "22CD602", RegisterNos: expandRange("7376231CD132", "7376231CD141")},

		// S.No 84 - EW 216 - B.E. MZ - 22MC602
		{HallNo: "EW 216", CourseCode: "22MC602", RegisterNos: expandRange("7376231MZ144", "7376231MZ153")},

		// S.No 85 - EW 218 - B.E. CD - 22CD602
		{HallNo: "EW 218", CourseCode: "22CD602", RegisterNos: []string{"7376231CD503"}},

		// S.No 86 - EW 218 - B.Tech. AG - 22AG602
		{HallNo: "EW 218", CourseCode: "22AG602", RegisterNos: []string{"7376222AG158"}},

		// S.No 87 - EW 218 - B.E. CD - 22CD602
		{HallNo: "EW 218", CourseCode: "22CD602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CD142", "7376231CD162")...)
			r = append(r, expandRange("7376241CD501", "7376241CD503")...)
			return r
		}()},

		// S.No 88 - EW 218 - B.E. MZ - 22MC602
		{HallNo: "EW 218", CourseCode: "22MC602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231MZ154", "7376231MZ158")...)
			r = append(r, expandRange("7376241MZ501", "7376241MZ506")...)
			return r
		}()},

		// S.No 89 - EW 218 - B.Tech. AG - 22AG602
		{HallNo: "EW 218", CourseCode: "22AG602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AG102", "7376232AG109")...)
			r = append(r, expandRange("7376232AG111", "7376232AG115")...)
			return r
		}()},

		// S.No 90 - MH 301 - B.E. CS - 22CS602
		{HallNo: "MH 301", CourseCode: "22CS602", RegisterNos: []string{
			"7376221CS109", "7376221CS111", "7376221CS114", "7376221CS118",
			"7376221CS140", "7376221CS196", "7376221CS229", "7376221CS240",
			"7376221CS275", "7376221CS288", "7376221CS322", "7376221CS340",
		}},

		// S.No 91 - MH 301 - B.E. EC - 22EC602
		{HallNo: "MH 301", CourseCode: "22EC602", RegisterNos: []string{
			"7376221EC107", "7376221EC151", "7376221EC192", "7376221EC226",
		}},

		// S.No 92 - MH 301 - B.E. CS - 22CS602
		{HallNo: "MH 301", CourseCode: "22CS602", RegisterNos: expandRange("7376231CS101", "7376231CS103")},

		// S.No 93 - MH 301 - B.E. EC - 22EC602
		{HallNo: "MH 301", CourseCode: "22EC602", RegisterNos: expandRange("7376231EC101", "7376231EC106")},

		// S.No 94 - MH 302 - B.E. CS - 22CS602
		{HallNo: "MH 302", CourseCode: "22CS602", RegisterNos: expandRange("7376231CS104", "7376231CS118")},

		// S.No 95 - MH 302 - B.E. EC - 22EC602
		{HallNo: "MH 302", CourseCode: "22EC602", RegisterNos: expandRange("7376231EC107", "7376231EC116")},

		// S.No 96 - MH 303 - B.E. CS - 22CS602
		{HallNo: "MH 303", CourseCode: "22CS602", RegisterNos: expandRange("7376231CS119", "7376231CS133")},

		// S.No 97 - MH 303 - B.E. EC - 22EC602
		{HallNo: "MH 303", CourseCode: "22EC602", RegisterNos: expandRange("7376231EC117", "7376231EC126")},

		// S.No 98 - MH 305 - B.E. CS - 22CS602
		{HallNo: "MH 305", CourseCode: "22CS602", RegisterNos: expandRange("7376231CS134", "7376231CS148")},

		// S.No 99 - MH 305 - B.E. EC - 22EC602
		{HallNo: "MH 305", CourseCode: "22EC602", RegisterNos: expandRange("7376231EC127", "7376231EC136")},

		// S.No 100 - WW 005 - B.Tech. IT - 22IT602
		{HallNo: "WW 005", CourseCode: "22IT602", RegisterNos: expandRange("7376232IT239", "7376232IT248")},

		// S.No 101 - WW 005 - B.Tech. AL - 22AM602
		{HallNo: "WW 005", CourseCode: "22AM602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AL187", "7376232AL193")...)
			r = append(r, expandRange("7376232AL195", "7376232AL202")...)
			return r
		}()},

		// S.No 102 - WW 006 - B.E. ME - 22ME602
		{HallNo: "WW 006", CourseCode: "22ME602", RegisterNos: expandRange("7376231ME102", "7376231ME116")},

		// S.No 103 - WW 006 - B.Tech. IT - 22IT602
		{HallNo: "WW 006", CourseCode: "22IT602", RegisterNos: expandRange("7376232IT269", "7376232IT278")},

		// S.No 104 - WW 007 - 22IT602
		{HallNo: "WW 007", CourseCode: "22IT602", RegisterNos: []string{"7376232IT504"}},

		// S.No 105 - WW 007 - B.E. ME - 22ME602
		{HallNo: "WW 007", CourseCode: "22ME602", RegisterNos: expandRange("7376231ME117", "7376231ME131")},

		// S.No 106 - WW 007 - B.Tech. IT - 22IT602
		{HallNo: "WW 007", CourseCode: "22IT602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232IT279", "7376232IT281")...)
			r = append(r, expandRange("7376232IT283", "7376232IT286")...)
			r = append(r, "7376242IT501", "7376242IT502")
			return r
		}()},

		// S.No 107 - WW 008 - B.E. ME - 22ME602
		{HallNo: "WW 008", CourseCode: "22ME602", RegisterNos: expandRange("7376231ME142", "7376231ME156")},

		// S.No 108 - WW 008 - B.Tech. BT - 22BT602
		{HallNo: "WW 008", CourseCode: "22BT602", RegisterNos: expandRange("7376232BT101", "7376232BT110")},

		// S.No 109 - WW 011 - B.E. EI - 22EI602
		{HallNo: "WW 011", CourseCode: "22EI602", RegisterNos: expandRange("7376231EI105", "7376231EI119")},

		// S.No 110 - WW 011 - B.Tech. BT - 22BT602
		{HallNo: "WW 011", CourseCode: "22BT602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232BT178", "7376232BT185")...)
			r = append(r, "7376232BT187", "7376232BT188")
			return r
		}()},

		// S.No 111 - WW 012 - B.E. EI - 22EI602
		{HallNo: "WW 012", CourseCode: "22EI602", RegisterNos: expandRange("7376231EI135", "7376231EI149")},

		// S.No 112 - WW 012 - B.Tech. BT - 22BT602
		{HallNo: "WW 012", CourseCode: "22BT602", RegisterNos: expandRange("7376232BT199", "7376232BT208")},

		// S.No 113 - WW 113 - B.E. CS - 22CS602
		{HallNo: "WW 113", CourseCode: "22CS602", RegisterNos: expandRange("7376231CS195", "7376231CS209")},

		// S.No 114 - WW 113 - B.E. EC - 22EC602
		{HallNo: "WW 113", CourseCode: "22EC602", RegisterNos: expandRange("7376231EC167", "7376231EC176")},

		// S.No 115 - WW 114 - B.E. CS - 22CS602
		{HallNo: "WW 114", CourseCode: "22CS602", RegisterNos: expandRange("7376231CS225", "7376231CS239")},

		// S.No 116 - WW 114 - B.E. EC - 22EC602
		{HallNo: "WW 114", CourseCode: "22EC602", RegisterNos: expandRange("7376231EC187", "7376231EC196")},

		// S.No 117 - WW 115 - B.E. CS - 22CS602
		{HallNo: "WW 115", CourseCode: "22CS602", RegisterNos: expandRange("7376231CS270", "7376231CS284")},

		// S.No 118 - WW 115 - B.E. EC - 22EC602
		{HallNo: "WW 115", CourseCode: "22EC602", RegisterNos: expandRange("7376231EC217", "7376231EC226")},

		// S.No 119 - WW 117 - B.E. CS - 22CS602
		{HallNo: "WW 117", CourseCode: "22CS602", RegisterNos: expandRange("7376231CS301", "7376231CS315")},

		// S.No 120 - WW 117 - B.E. EC - 22EC602
		{HallNo: "WW 117", CourseCode: "22EC602", RegisterNos: expandRange("7376231EC237", "7376231EC246")},

		// S.No 121 - WW 118 - 22EC602
		{HallNo: "WW 118", CourseCode: "22EC602", RegisterNos: expandRange("7376231EC287", "7376231EC296")},

		// S.No 122 - WW 118 - B.Tech. AD - 22AI602
		{HallNo: "WW 118", CourseCode: "22AI602", RegisterNos: expandRange("7376232AD105", "7376232AD119")},

		// S.No 123 - WW 202 - B.E. EC - 22EC602
		{HallNo: "WW 202", CourseCode: "22EC602", RegisterNos: expandRange("7376231EC297", "7376231EC321")},

		// S.No 124 - WW 202 - B.Tech. AD - 22AI602
		{HallNo: "WW 202", CourseCode: "22AI602", RegisterNos: expandRange("7376232AD120", "7376232AD144")},

		// S.No 125 - WW 203 - B.E. EC - 22EC602
		{HallNo: "WW 203", CourseCode: "22EC602", RegisterNos: expandRange("7376231EC322", "7376231EC331")},

		// S.No 126 - WW 203 - B.Tech. AD - 22AI602
		{HallNo: "WW 203", CourseCode: "22AI602", RegisterNos: expandRange("7376232AD145", "7376232AD159")},

		// S.No 127 - WW 204 - B.Tech. IT - 22IT602
		{HallNo: "WW 204", CourseCode: "22IT602", RegisterNos: expandRange("7376232IT112", "7376232IT121")},

		// S.No 128 - WW 204 - B.Tech. AD - 22AI602
		{HallNo: "WW 204", CourseCode: "22AI602", RegisterNos: expandRange("7376232AD220", "7376232AD234")},

		// S.No 129 - WW 205 - B.Tech. IT - 22IT602
		{HallNo: "WW 205", CourseCode: "22IT602", RegisterNos: expandRange("7376232IT173", "7376232IT182")},

		// S.No 130 - WW 205 - B.Tech. AL - 22AM602
		{HallNo: "WW 205", CourseCode: "22AM602", RegisterNos: expandRange("7376232AL107", "7376232AL121")},

		// S.No 131 - WW 211 - B.E. EC - 22EC602
		{HallNo: "WW 211", CourseCode: "22EC602", RegisterNos: []string{"7376231EC507"}},

		// S.No 132 - WW 211 - 22EC602
		{HallNo: "WW 211", CourseCode: "22EC602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EC332", "7376231EC334")...)
			r = append(r, expandRange("7376241EC501", "7376241EC506")...)
			return r
		}()},

		// S.No 133 - WW 211 - B.Tech. AD - 22AI602
		{HallNo: "WW 211", CourseCode: "22AI602", RegisterNos: expandRange("7376232AD160", "7376232AD174")},

		// S.No 134 - WW 212 - B.E. CE - 22CE602
		{HallNo: "WW 212", CourseCode: "22CE602", RegisterNos: []string{
			"7376221CE105", "7376221CE122", "7376221CE124", "7376221CE138", "7376231CE503",
		}},

		// S.No 135 - WW 212 - B.E. MC - 22MC602
		{HallNo: "WW 212", CourseCode: "22MC602", RegisterNos: []string{"7376231MC506"}},

		// S.No 136 - WW 212 - B.E. BM - 22BM602
		{HallNo: "WW 212", CourseCode: "22BM602", RegisterNos: []string{"7376231BM501", "7376231BM502"}},

		// S.No 137 - WW 212 - B.E. CE - 22CE602
		{HallNo: "WW 212", CourseCode: "22CE602", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CE101")
			r = append(r, expandRange("7376231CE103", "7376231CE129")...)
			r = append(r, expandRange("7376241CE501", "7376241CE504")...)
			return r
		}()},

		// S.No 138 - WW 212 - B.E. BM - 22BM602
		{HallNo: "WW 212", CourseCode: "22BM602", RegisterNos: expandRange("7376231BM146", "7376231BM151")},

		// S.No 139 - WW 213 - B.Tech. AD - 22AI602
		{HallNo: "WW 213", CourseCode: "22AI602", RegisterNos: []string{"7376232AD502"}},

		// S.No 140 - WW 213 - B.Tech. IT - 22IT602
		{HallNo: "WW 213", CourseCode: "22IT602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232IT152", "7376232IT160")...)
			r = append(r, "7376232IT162")
			return r
		}()},

		// S.No 141 - WW 213 - B.Tech. AD - 22AI602
		{HallNo: "WW 213", CourseCode: "22AI602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AD280", "7376232AD286")...)
			r = append(r, expandRange("7376242AD501", "7376242AD507")...)
			return r
		}()},

		// S.No 142 - WW 214 - B.Tech. IT - 22IT602
		{HallNo: "WW 214", CourseCode: "22IT602", RegisterNos: expandRange("7376232IT183", "7376232IT192")},

		// S.No 143 - WW 214 - B.Tech. AL - 22AM602
		{HallNo: "WW 214", CourseCode: "22AM602", RegisterNos: expandRange("7376232AL122", "7376232AL136")},

		// S.No 144 - WW 215 - B.Tech. IT - 22IT602
		{HallNo: "WW 215", CourseCode: "22IT602", RegisterNos: expandRange("7376232IT193", "7376232IT202")},

		// S.No 145 - WW 215 - B.Tech. AL - 22AM602
		{HallNo: "WW 215", CourseCode: "22AM602", RegisterNos: expandRange("7376232AL137", "7376232AL151")},

		// S.No 146 - WW 218 - B.E. EE - 22EE602
		{HallNo: "WW 218", CourseCode: "22EE602", RegisterNos: expandRange("7376231EE102", "7376231EE111")},

		// S.No 147 - WW 218 - B.Tech. AG - 22AG602
		{HallNo: "WW 218", CourseCode: "22AG602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AG116", "7376232AG129")...)
			r = append(r, "7376232AG131")
			return r
		}()},

		// S.No 148 - WW 219 - B.E. EE - 22EE602
		{HallNo: "WW 219", CourseCode: "22EE602", RegisterNos: expandRange("7376231EE112", "7376231EE121")},

		// S.No 149 - WW 219 - B.Tech. AG - 22AG602
		{HallNo: "WW 219", CourseCode: "22AG602", RegisterNos: expandRange("7376232AG132", "7376232AG146")},

		// S.No 150 - WW 222 - B.Tech. FD - 22FD602
		{HallNo: "WW 222", CourseCode: "22FD602", RegisterNos: []string{"7376222FD107", "7376222FD125"}},

		// S.No 151 - WW 222 - B.E. EE - 22EE602
		{HallNo: "WW 222", CourseCode: "22EE602", RegisterNos: expandRange("7376231EE122", "7376231EE146")},

		// S.No 152 - WW 222 - B.Tech. FD - 22FD602
		{HallNo: "WW 222", CourseCode: "22FD602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232FD101", "7376232FD103")...)
			r = append(r, expandRange("7376232FD105", "7376232FD112")...)
			return r
		}()},

		// S.No 153 - WW 222 - B.Tech. AG - 22AG602
		{HallNo: "WW 222", CourseCode: "22AG602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AG147", "7376232AG154")...)
			r = append(r, expandRange("7376242AG501", "7376242AG504")...)
			return r
		}()},

		// S.No 154 - WW 223 - B.E. EE - 22EE602
		{HallNo: "WW 223", CourseCode: "22EE602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EE147", "7376231EE161")...)
			r = append(r, expandRange("7376241EE501", "7376241EE506")...)
			return r
		}()},

		// S.No 155 - WW 223 - B.Tech. FD - 22FD602
		{HallNo: "WW 223", CourseCode: "22FD602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232FD113", "7376232FD120")...)
			r = append(r, expandRange("7376232FD122", "7376232FD138")...)
			return r
		}()},

		// S.No 156 - WW 223 - B.Tech. CT - 22CT602
		{HallNo: "WW 223", CourseCode: "22CT602", RegisterNos: expandRange("7376232CT101", "7376232CT104")},

		// S.No 157 - WW 224 - B.Tech. FD - 22FD602
		{HallNo: "WW 224", CourseCode: "22FD602", RegisterNos: expandRange("7376232FD139", "7376232FD152")},

		// S.No 158 - WW 224 - B.Tech. FT - 22FT602
		{HallNo: "WW 224", CourseCode: "22FT602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232FT101", "7376232FT106")...)
			r = append(r, expandRange("7376232FT108", "7376232FT112")...)
			return r
		}()},

		// S.No 159 - WW 224 - B.Tech. CT - 22CT602
		{HallNo: "WW 224", CourseCode: "22CT602", RegisterNos: expandRange("7376232CT105", "7376232CT129")},

		// S.No 160 - WW 225 - B.E. SE - 22IS602
		{HallNo: "WW 225", CourseCode: "22IS602", RegisterNos: []string{
			"7376221SE131", "7376221SE134", "7376221SE140", "7376221SE157",
		}},

		// S.No 161 - WW 225 - 22IS602
		{HallNo: "WW 225", CourseCode: "22IS602", RegisterNos: []string{"7376231SE101"}},

		// S.No 162 - WW 225 - B.Tech. FT - 22FT602
		{HallNo: "WW 225", CourseCode: "22FT602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232FT113", "7376232FT120")...)
			r = append(r, "7376242FT501")
			return r
		}()},

		// S.No 163 - WW 225 - B.Tech. CT - 22CT602
		{HallNo: "WW 225", CourseCode: "22CT602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232CT130", "7376232CT162")...)
			r = append(r, expandRange("7376242CT501", "7376242CT503")...)
			return r
		}()},

		// S.No 164 - WW 226 - B.E. SE - 22IS602
		{HallNo: "WW 226", CourseCode: "22IS602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231SE102", "7376231SE143")...)
			r = append(r, expandRange("7376231SE145", "7376231SE152")...)
			return r
		}()},

		// S.No 165 - WW 227 - 22IS602
		{HallNo: "WW 227", CourseCode: "22IS602", RegisterNos: []string{"7376231SE504"}},

		// S.No 166 - WW 227 - B.E. BM - 22BM602
		{HallNo: "WW 227", CourseCode: "22BM602", RegisterNos: expandRange("7376231BM101", "7376231BM145")},

		// S.No 167 - WW 227 - B.E. SE - 22IS602
		{HallNo: "WW 227", CourseCode: "22IS602", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231SE153", "7376231SE155")...)
			r = append(r, "7376241SE501")
			return r
		}()},
	}
}

// buildSeatingData13AN returns all seating records from the 13-05-2026 AN exam
// Exam Date: 13-05-2026 | Session: AN - 01:30 PM to 04:30 PM
func buildSeatingData13AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.E. EC - 22EC002
		{HallNo: "EW 101", CourseCode: "22EC002", RegisterNos: []string{
			"7376221EC102", "7376221EC151", "7376231EC507",
		}},

		// S.No 2 - EW 101 - 22EC002
		{HallNo: "EW 101", CourseCode: "22EC002", RegisterNos: []string{
			"7376231EC110", "7376231EC131", "7376231EC132",
			"7376241EC501", "7376241EC508", "7376241EC516", "7376241EC521",
		}},

		// S.No 3 - EW 101 - B.E. MZ - 22MC015
		{HallNo: "EW 101", CourseCode: "22MC015", RegisterNos: []string{
			"7376231MZ106", "7376231MZ111", "7376231MZ145", "7376241MZ501",
		}},

		// S.No 4 - EW 101 - B.Tech. BT - 22BT001
		{HallNo: "EW 101", CourseCode: "22BT001", RegisterNos: []string{
			"7376232BT142", "7376232BT152", "7376232BT163", "7376232BT176",
		}},

		// S.No 5 - EW 101 - B.Tech. CB - 22CB014
		{HallNo: "EW 101", CourseCode: "22CB014", RegisterNos: []string{
			"7376232CB106", "7376232CB111", "7376232CB123",
			"7376232CB133", "7376232CB162", "7376242CB502",
		}},

		// S.No 6 - EW 101 - B.Tech. AD - 22AI019
		{HallNo: "EW 101", CourseCode: "22AI019", RegisterNos: []string{"7376232AD184"}},

		// S.No 7 - EW 102 - B.E. CE - 22CE002
		{HallNo: "EW 102", CourseCode: "22CE002", RegisterNos: []string{"7376221CE124"}},

		// S.No 8 - EW 102 - B.E. EI - 22EI015
		{HallNo: "EW 102", CourseCode: "22EI015", RegisterNos: []string{"7376231EI503"}},

		// S.No 9 - EW 102 - B.E. ME - 22ME005
		{HallNo: "EW 102", CourseCode: "22ME005", RegisterNos: []string{"7376221ME138"}},

		// S.No 10 - EW 102 - B.E. SE - 22IS002
		{HallNo: "EW 102", CourseCode: "22IS002", RegisterNos: []string{"7376221SE134", "7376231SE504"}},

		// S.No 11 - EW 102 - B.E. CD - 22CD001
		{HallNo: "EW 102", CourseCode: "22CD001", RegisterNos: []string{
			"7376221CD126", "7376221CD144", "7376221CD153",
		}},

		// S.No 12 - EW 102 - B.Tech. FD - 22FD017
		{HallNo: "EW 102", CourseCode: "22FD017", RegisterNos: []string{
			"7376222FD107", "7376222FD121", "7376222FD125",
		}},

		// S.No 13 - EW 102 - B.Tech. FT - 22FT019
		{HallNo: "EW 102", CourseCode: "22FT019", RegisterNos: []string{"7376232FT501"}},

		// S.No 14 - EW 102 - B.Tech. AL - 22AM010
		{HallNo: "EW 102", CourseCode: "22AM010", RegisterNos: []string{"7376222AL169"}},

		// S.No 15 - EW 102 - B.Tech. AG - 22AG010
		{HallNo: "EW 102", CourseCode: "22AG010", RegisterNos: []string{"7376222AG120", "7376222AG158"}},

		// S.No 16 - EW 102 - B.E. EE - 22EE019
		{HallNo: "EW 102", CourseCode: "22EE019", RegisterNos: []string{"7376231EE115"}},

		// S.No 17 - EW 102 - B.E. EI - 22EI015
		{HallNo: "EW 102", CourseCode: "22EI015", RegisterNos: []string{"7376231EI156"}},

		// S.No 18 - EW 102 - B.E. BM - 22BM008
		{HallNo: "EW 102", CourseCode: "22BM008", RegisterNos: []string{"7376231BM107", "7376231BM148"}},

		// S.No 19 - EW 102 - B.Tech. IT - 22IT031
		{HallNo: "EW 102", CourseCode: "22IT031", RegisterNos: []string{"7376242IT502"}},

		// S.No 20 - EW 102 - B.Tech. AD - 22AI019
		{HallNo: "EW 102", CourseCode: "22AI019", RegisterNos: []string{"7376232AD282", "7376242AD510"}},
	}
}

// buildSeatingData14FN returns all seating records from the 14-05-2026 FN exam
// Exam Date: 14-05-2026 | Session: FN - 09:00 AM to 12:00 PM
func buildSeatingData14FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - AE 302 - B.E. EC - 22EC403
		{HallNo: "AE 302", CourseCode: "22EC403", RegisterNos: []string{
			"7376231EC501", "7376231EC502", "7376231EC503", "7376231EC504",
			"7376231EC505", "7376231EC507", "7376231EC508", "7376231EC509",
			"7376231EC514",
		}},

		// S.No 2 - AE 302 - 22EC403
		{HallNo: "AE 302", CourseCode: "22EC403", RegisterNos: []string{"7376231EC334"}},

		// S.No 3 - AE 302 - B.E. CS - 22CS403
		{HallNo: "AE 302", CourseCode: "22CS403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS151", "7376241CS157")...)
			r = append(r, expandRange("7376241CS159", "7376241CS166")...)
			return r
		}()},

		// S.No 4 - EW 101 - B.E. EC - 22EC403
		{HallNo: "EW 101", CourseCode: "22EC403", RegisterNos: []string{"7376231EC516", "7376231EC521"}},

		// S.No 5 - EW 101 - B.E. CS - 22CS403
		{HallNo: "EW 101", CourseCode: "22CS403", RegisterNos: expandRange("7376241CS167", "7376241CS181")},

		// S.No 6 - EW 101 - B.E. EC - 22EC403
		{HallNo: "EW 101", CourseCode: "22EC403", RegisterNos: expandRange("7376241EC103", "7376241EC110")},

		// S.No 7 - EW 102 - B.E. CS - 22CS403
		{HallNo: "EW 102", CourseCode: "22CS403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS182", "7376241CS188")...)
			r = append(r, expandRange("7376241CS190", "7376241CS197")...)
			return r
		}()},

		// S.No 8 - EW 102 - B.E. EC - 22EC403
		{HallNo: "EW 102", CourseCode: "22EC403", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EC112", "7376241EC113")
			r = append(r, expandRange("7376241EC115", "7376241EC122")...)
			return r
		}()},

		// S.No 9 - EW 103 - B.E. CS - 22CS403
		{HallNo: "EW 103", CourseCode: "22CS403", RegisterNos: expandRange("7376241CS244", "7376241CS258")},

		// S.No 10 - EW 103 - B.E. EC - 22EC403
		{HallNo: "EW 103", CourseCode: "22EC403", RegisterNos: expandRange("7376241EC153", "7376241EC162")},

		// S.No 11 - EW 104 - B.E. CS - 22CS403
		{HallNo: "EW 104", CourseCode: "22CS403", RegisterNos: expandRange("7376241CS334", "7376241CS348")},

		// S.No 12 - EW 104 - B.E. EC - 22EC403
		{HallNo: "EW 104", CourseCode: "22EC403", RegisterNos: expandRange("7376241EC215", "7376241EC224")},

		// S.No 13 - EW 105 - B.E. CS - 22CS403
		{HallNo: "EW 105", CourseCode: "22CS403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS349", "7376241CS353")...)
			r = append(r, expandRange("7376241CS355", "7376241CS364")...)
			return r
		}()},

		// S.No 14 - EW 105 - B.E. EC - 22EC403
		{HallNo: "EW 105", CourseCode: "22EC403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EC225", "7376241EC230")...)
			r = append(r, expandRange("7376241EC232", "7376241EC235")...)
			return r
		}()},

		// S.No 15 - EW 106 - B.E. CS - 22CS403
		{HallNo: "EW 106", CourseCode: "22CS403", RegisterNos: []string{"7376241CS503"}},

		// S.No 16 - EW 106 - 22CS403
		{HallNo: "EW 106", CourseCode: "22CS403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS466", "7376241CS476")...)
			r = append(r, expandRange("7376251CS501", "7376251CS503")...)
			return r
		}()},

		// S.No 17 - EW 106 - B.E. EC - 22EC403
		{HallNo: "EW 106", CourseCode: "22EC403", RegisterNos: expandRange("7376241EC311", "7376241EC320")},

		// S.No 18 - EW 107 - B.E. CS - 22CS403
		{HallNo: "EW 107", CourseCode: "22CS403", RegisterNos: expandRange("7376241CS213", "7376241CS227")},

		// S.No 19 - EW 107 - B.E. EC - 22EC403
		{HallNo: "EW 107", CourseCode: "22EC403", RegisterNos: expandRange("7376241EC133", "7376241EC142")},

		// S.No 20 - EW 108 - B.E. CS - 22CS403
		{HallNo: "EW 108", CourseCode: "22CS403", RegisterNos: expandRange("7376241CS259", "7376241CS273")},

		// S.No 21 - EW 108 - B.E. EC - 22EC403
		{HallNo: "EW 108", CourseCode: "22EC403", RegisterNos: expandRange("7376241EC163", "7376241EC172")},

		// S.No 22 - EW 109 - B.E. CS - 22CS403
		{HallNo: "EW 109", CourseCode: "22CS403", RegisterNos: expandRange("7376241CS289", "7376241CS303")},

		// S.No 23 - EW 109 - B.E. EC - 22EC403
		{HallNo: "EW 109", CourseCode: "22EC403", RegisterNos: expandRange("7376241EC184", "7376241EC193")},

		// S.No 24 - EW 111 - B.E. CS - 22CS403
		{HallNo: "EW 111", CourseCode: "22CS403", RegisterNos: expandRange("7376241CS319", "7376241CS333")},

		// S.No 25 - EW 111 - B.E. EC - 22EC403
		{HallNo: "EW 111", CourseCode: "22EC403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EC204", "7376241EC207")...)
			r = append(r, expandRange("7376241EC209", "7376241EC214")...)
			return r
		}()},

		// S.No 26 - EW 112 - B.E. CS - 22CS403
		{HallNo: "EW 112", CourseCode: "22CS403", RegisterNos: expandRange("7376241CS365", "7376241CS379")},

		// S.No 27 - EW 112 - B.E. EC - 22EC403
		{HallNo: "EW 112", CourseCode: "22EC403", RegisterNos: expandRange("7376241EC236", "7376241EC245")},

		// S.No 28 - EW 113 - B.Tech. IT - 22IT403
		{HallNo: "EW 113", CourseCode: "22IT403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT300", "7376242IT303")...)
			r = append(r, expandRange("7376242IT305", "7376242IT315")...)
			return r
		}()},

		// S.No 29 - EW 113 - B.Tech. AD - 22AI403
		{HallNo: "EW 113", CourseCode: "22AI403", RegisterNos: expandRange("7376242AD206", "7376242AD215")},

		// S.No 30 - EW 114 - 22AI403
		{HallNo: "EW 114", CourseCode: "22AI403", RegisterNos: expandRange("7376242AD266", "7376242AD275")},

		// S.No 31 - EW 114 - B.Tech. AL - 22AM403
		{HallNo: "EW 114", CourseCode: "22AM403", RegisterNos: expandRange("7376242AL110", "7376242AL124")},

		// S.No 32 - EW 115 - B.Tech. AD - 22AI403
		{HallNo: "EW 115", CourseCode: "22AI403", RegisterNos: expandRange("7376242AD311", "7376242AD320")},

		// S.No 33 - EW 115 - B.Tech. AL - 22AM403
		{HallNo: "EW 115", CourseCode: "22AM403", RegisterNos: expandRange("7376242AL160", "7376242AL174")},

		// S.No 34 - EW 116 - B.Tech. AD - 22AI403
		{HallNo: "EW 116", CourseCode: "22AI403", RegisterNos: expandRange("7376242AD321", "7376242AD330")},

		// S.No 35 - EW 116 - B.Tech. AL - 22AM403
		{HallNo: "EW 116", CourseCode: "22AM403", RegisterNos: expandRange("7376242AL175", "7376242AL189")},

		// S.No 36 - EW 117 - B.Tech. AD - 22AI403
		{HallNo: "EW 117", CourseCode: "22AI403", RegisterNos: []string{"7376242AD510"}},

		// S.No 37 - EW 117 - 22AI403
		{HallNo: "EW 117", CourseCode: "22AI403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AD341", "7376242AD346")...)
			r = append(r, expandRange("7376252AD501", "7376252AD503")...)
			return r
		}()},

		// S.No 38 - EW 117 - B.Tech. AL - 22AM403
		{HallNo: "EW 117", CourseCode: "22AM403", RegisterNos: expandRange("7376242AL205", "7376242AL219")},

		// S.No 39 - EW 118 - B.E. EE - 22EE403
		{HallNo: "EW 118", CourseCode: "22EE403", RegisterNos: []string{"7376231EE111"}},

		// S.No 40 - EW 118 - 22EE403
		{HallNo: "EW 118", CourseCode: "22EE403", RegisterNos: expandRange("7376241EE101", "7376241EE106")},

		// S.No 41 - EW 118 - B.Tech. BT - 22BT403
		{HallNo: "EW 118", CourseCode: "22BT403", RegisterNos: expandRange("7376242BT103", "7376242BT117")},

		// S.No 42 - EW 118 - B.Tech. AD - 22AI403
		{HallNo: "EW 118", CourseCode: "22AI403", RegisterNos: expandRange("7376252AD514", "7376252AD516")},

		// S.No 43 - EW 201 - B.E. EC - 22EC403
		{HallNo: "EW 201", CourseCode: "22EC403", RegisterNos: expandRange("7376241EC341", "7376241EC350")},

		// S.No 44 - EW 201 - B.Tech. IT - 22IT403
		{HallNo: "EW 201", CourseCode: "22IT403", RegisterNos: expandRange("7376242IT104", "7376242IT118")},

		// S.No 45 - EW 202 - B.E. EC - 22EC403
		{HallNo: "EW 202", CourseCode: "22EC403", RegisterNos: []string{"7376241EC516", "7376241EC517"}},

		// S.No 46 - EW 202 - 22EC403
		{HallNo: "EW 202", CourseCode: "22EC403", RegisterNos: expandRange("7376251EC501", "7376251EC508")},

		// S.No 47 - EW 202 - B.Tech. IT - 22IT403
		{HallNo: "EW 202", CourseCode: "22IT403", RegisterNos: expandRange("7376242IT134", "7376242IT148")},

		// S.No 48 - EW 203 - 22IT403
		{HallNo: "EW 203", CourseCode: "22IT403", RegisterNos: expandRange("7376242IT316", "7376242IT330")},

		// S.No 49 - EW 203 - B.Tech. AD - 22AI403
		{HallNo: "EW 203", CourseCode: "22AI403", RegisterNos: expandRange("7376242AD216", "7376242AD225")},

		// S.No 50 - EW 204 - B.Tech. IT - 22IT403
		{HallNo: "EW 204", CourseCode: "22IT403", RegisterNos: expandRange("7376252IT507", "7376252IT516")},

		// S.No 51 - EW 204 - B.Tech. AD - 22AI403
		{HallNo: "EW 204", CourseCode: "22AI403", RegisterNos: expandRange("7376242AD246", "7376242AD255")},

		// S.No 52 - EW 205 - 22AI403
		{HallNo: "EW 205", CourseCode: "22AI403", RegisterNos: expandRange("7376242AD276", "7376242AD285")},

		// S.No 53 - EW 205 - B.Tech. AL - 22AM403
		{HallNo: "EW 205", CourseCode: "22AM403", RegisterNos: expandRange("7376242AL125", "7376242AL134")},

		// S.No 54 - EW 206 - B.Tech. AD - 22AI403
		{HallNo: "EW 206", CourseCode: "22AI403", RegisterNos: expandRange("7376242AD286", "7376242AD310")},

		// S.No 55 - EW 206 - B.Tech. AL - 22AM403
		{HallNo: "EW 206", CourseCode: "22AM403", RegisterNos: expandRange("7376242AL135", "7376242AL159")},

		// S.No 56 - EW 207 - B.E. CS - 22CS403
		{HallNo: "EW 207", CourseCode: "22CS403", RegisterNos: expandRange("7376241CS451", "7376241CS465")},

		// S.No 57 - EW 207 - B.E. EC - 22EC403
		{HallNo: "EW 207", CourseCode: "22EC403", RegisterNos: expandRange("7376241EC301", "7376241EC310")},

		// S.No 58 - EW 208 - B.E. CS - 22CS403
		{HallNo: "EW 208", CourseCode: "22CS403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS504", "7376251CS513")...)
			r = append(r, expandRange("7376251CS515", "7376251CS519")...)
			return r
		}()},

		// S.No 59 - EW 208 - B.E. EC - 22EC403
		{HallNo: "EW 208", CourseCode: "22EC403", RegisterNos: expandRange("7376241EC321", "7376241EC330")},

		// S.No 60 - EW 209 - 22EC403
		{HallNo: "EW 209", CourseCode: "22EC403", RegisterNos: []string{
			"7376241EC504", "7376241EC506", "7376241EC508", "7376241EC511",
			"7376241EC512", "7376241EC513", "7376241EC514", "7376241EC515",
		}},

		// S.No 61 - EW 209 - 22EC403
		{HallNo: "EW 209", CourseCode: "22EC403", RegisterNos: []string{"7376241EC351", "7376241EC352"}},

		// S.No 62 - EW 209 - B.Tech. IT - 22IT403
		{HallNo: "EW 209", CourseCode: "22IT403", RegisterNos: expandRange("7376242IT119", "7376242IT133")},

		// S.No 63 - EW 210 - B.Tech. AD - 22AI403
		{HallNo: "EW 210", CourseCode: "22AI403", RegisterNos: []string{
			"7376232AD115", "7376232AD122", "7376232AD131", "7376232AD136",
			"7376232AD174", "7376232AD250", "7376232AD265",
		}},

		// S.No 64 - EW 210 - B.E. EC - 22EC403
		{HallNo: "EW 210", CourseCode: "22EC403", RegisterNos: expandRange("7376251EC519", "7376251EC521")},

		// S.No 65 - EW 210 - B.Tech. IT - 22IT403
		{HallNo: "EW 210", CourseCode: "22IT403", RegisterNos: expandRange("7376242IT165", "7376242IT174")},

		// S.No 66 - EW 211 - 22IT403
		{HallNo: "EW 211", CourseCode: "22IT403", RegisterNos: expandRange("7376242IT240", "7376242IT249")},

		// S.No 67 - EW 211 - B.Tech. AD - 22AI403
		{HallNo: "EW 211", CourseCode: "22AI403", RegisterNos: expandRange("7376242AD151", "7376242AD160")},

		// S.No 68 - EW 212 - B.Tech. IT - 22IT403
		{HallNo: "EW 212", CourseCode: "22IT403", RegisterNos: expandRange("7376242IT250", "7376242IT274")},

		// S.No 69 - EW 212 - B.Tech. AD - 22AI403
		{HallNo: "EW 212", CourseCode: "22AI403", RegisterNos: expandRange("7376242AD161", "7376242AD185")},

		// S.No 70 - EW 213 - B.E. EE - 22EE403
		{HallNo: "EW 213", CourseCode: "22EE403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EE107", "7376241EE111")...)
			r = append(r, expandRange("7376241EE113", "7376241EE117")...)
			return r
		}()},

		// S.No 71 - EW 213 - B.Tech. BT - 22BT403
		{HallNo: "EW 213", CourseCode: "22BT403", RegisterNos: expandRange("7376242BT118", "7376242BT132")},

		// S.No 72 - EW 214 - B.E. EE - 22EE403
		{HallNo: "EW 214", CourseCode: "22EE403", RegisterNos: expandRange("7376241EE118", "7376241EE127")},

		// S.No 73 - EW 214 - B.Tech. BT - 22BT403
		{HallNo: "EW 214", CourseCode: "22BT403", RegisterNos: expandRange("7376242BT133", "7376242BT147")},

		// S.No 74 - EW 215 - B.E. EE - 22EE403
		{HallNo: "EW 215", CourseCode: "22EE403", RegisterNos: expandRange("7376241EE128", "7376241EE137")},

		// S.No 75 - EW 215 - B.Tech. BT - 22BT403
		{HallNo: "EW 215", CourseCode: "22BT403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242BT148", "7376242BT160")...)
			r = append(r, "7376242BT162", "7376242BT163")
			return r
		}()},

		// S.No 76 - EW 216 - B.E. EE - 22EE403
		{HallNo: "EW 216", CourseCode: "22EE403", RegisterNos: expandRange("7376241EE138", "7376241EE147")},

		// S.No 77 - EW 216 - B.Tech. BT - 22BT403
		{HallNo: "EW 216", CourseCode: "22BT403", RegisterNos: expandRange("7376242BT164", "7376242BT173")},

		// S.No 78 - EW 217 - B.E. EE - 22EE403
		{HallNo: "EW 217", CourseCode: "22EE403", RegisterNos: expandRange("7376241EE148", "7376241EE157")},

		// S.No 79 - EW 217 - B.Tech. BT - 22BT403
		{HallNo: "EW 217", CourseCode: "22BT403", RegisterNos: expandRange("7376242BT174", "7376242BT183")},

		// S.No 80 - EW 218 - B.E. EE - 22EE403
		{HallNo: "EW 218", CourseCode: "22EE403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EE158", "7376241EE171")...)
			r = append(r, expandRange("7376241EE173", "7376241EE183")...)
			return r
		}()},

		// S.No 81 - EW 218 - B.Tech. BT - 22BT403
		{HallNo: "EW 218", CourseCode: "22BT403", RegisterNos: expandRange("7376242BT184", "7376242BT208")},

		// S.No 82 - MH 301 - B.E. CS - 22CS403
		{HallNo: "MH 301", CourseCode: "22CS403", RegisterNos: []string{"7376221CS118", "7376221CS196"}},

		// S.No 83 - MH 301 - B.E. EC - 22EC403
		{HallNo: "MH 301", CourseCode: "22EC403", RegisterNos: []string{
			"7376221EC102", "7376221EC105", "7376221EC107", "7376221EC116",
			"7376221EC119", "7376221EC131", "7376221EC139", "7376221EC142",
			"7376221EC149", "7376221EC151",
		}},

		// S.No 84 - MH 301 - B.E. CS - 22CS403
		{HallNo: "MH 301", CourseCode: "22CS403", RegisterNos: []string{
			"7376231CS102", "7376231CS103", "7376231CS173", "7376231CS190",
			"7376231CS235", "7376231CS244", "7376231CS259", "7376231CS292",
			"7376231CS346",
		}},

		// S.No 85 - MH 301 - 22CS403
		{HallNo: "MH 301", CourseCode: "22CS403", RegisterNos: expandRange("7376241CS102", "7376241CS105")},

		// S.No 86 - MH 302 - B.E. EC - 22EC403
		{HallNo: "MH 302", CourseCode: "22EC403", RegisterNos: []string{
			"7376221EC158", "7376221EC161", "7376221EC192", "7376221EC210",
			"7376221EC214", "7376221EC222", "7376221EC226", "7376221EC263",
			"7376221EC286", "7376221EC288",
		}},

		// S.No 87 - MH 302 - B.E. CS - 22CS403
		{HallNo: "MH 302", CourseCode: "22CS403", RegisterNos: expandRange("7376241CS106", "7376241CS120")},

		// S.No 88 - MH 303 - B.E. EC - 22EC403
		{HallNo: "MH 303", CourseCode: "22EC403", RegisterNos: []string{
			"7376221EC290", "7376221EC311", "7376221EC316", "7376221EC320",
			"7376221EC337", "7376221EC349",
		}},

		// S.No 89 - MH 303 - 22EC403
		{HallNo: "MH 303", CourseCode: "22EC403", RegisterNos: []string{
			"7376231EC101", "7376231EC102", "7376231EC110", "7376231EC112",
		}},

		// S.No 90 - MH 303 - B.E. CS - 22CS403
		{HallNo: "MH 303", CourseCode: "22CS403", RegisterNos: expandRange("7376241CS121", "7376241CS135")},

		// S.No 91 - MH 305 - B.E. EC - 22EC403
		{HallNo: "MH 305", CourseCode: "22EC403", RegisterNos: []string{
			"7376231EC121", "7376231EC196", "7376231EC231", "7376231EC275",
			"7376231EC283", "7376231EC297", "7376231EC305", "7376231EC318",
			"7376231EC330", "7376231EC331",
		}},

		// S.No 92 - MH 305 - B.E. CS - 22CS403
		{HallNo: "MH 305", CourseCode: "22CS403", RegisterNos: expandRange("7376241CS136", "7376241CS150")},

		// S.No 93 - WW 002 - B.Tech. IT - 22IT403
		{HallNo: "WW 002", CourseCode: "22IT403", RegisterNos: expandRange("7376242IT220", "7376242IT229")},

		// S.No 94 - WW 002 - B.Tech. AD - 22AI403
		{HallNo: "WW 002", CourseCode: "22AI403", RegisterNos: expandRange("7376242AD131", "7376242AD140")},

		// S.No 95 - WW 003 - B.Tech. IT - 22IT403
		{HallNo: "WW 003", CourseCode: "22IT403", RegisterNos: expandRange("7376242IT230", "7376242IT239")},

		// S.No 96 - WW 003 - B.Tech. AD - 22AI403
		{HallNo: "WW 003", CourseCode: "22AI403", RegisterNos: expandRange("7376242AD141", "7376242AD150")},

		// S.No 97 - WW 004 - B.Tech. IT - 22IT403
		{HallNo: "WW 004", CourseCode: "22IT403", RegisterNos: expandRange("7376242IT275", "7376242IT284")},

		// S.No 98 - WW 004 - B.Tech. AD - 22AI403
		{HallNo: "WW 004", CourseCode: "22AI403", RegisterNos: expandRange("7376242AD186", "7376242AD195")},

		// S.No 99 - WW 005 - B.Tech. IT - 22IT403
		{HallNo: "WW 005", CourseCode: "22IT403", RegisterNos: expandRange("7376242IT285", "7376242IT299")},

		// S.No 100 - WW 005 - B.Tech. AD - 22AI403
		{HallNo: "WW 005", CourseCode: "22AI403", RegisterNos: expandRange("7376242AD196", "7376242AD205")},

		// S.No 101 - WW 006 - B.Tech. IT - 22IT403
		{HallNo: "WW 006", CourseCode: "22IT403", RegisterNos: expandRange("7376242IT331", "7376242IT345")},

		// S.No 102 - WW 006 - B.Tech. AD - 22AI403
		{HallNo: "WW 006", CourseCode: "22AI403", RegisterNos: expandRange("7376242AD226", "7376242AD235")},

		// S.No 103 - WW 007 - B.Tech. IT - 22IT403
		{HallNo: "WW 007", CourseCode: "22IT403", RegisterNos: []string{
			"7376242IT502", "7376242IT506", "7376242IT509",
		}},

		// S.No 104 - WW 007 - 22IT403
		{HallNo: "WW 007", CourseCode: "22IT403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT346", "7376242IT351")...)
			r = append(r, expandRange("7376252IT501", "7376252IT506")...)
			return r
		}()},

		// S.No 105 - WW 007 - B.Tech. AD - 22AI403
		{HallNo: "WW 007", CourseCode: "22AI403", RegisterNos: expandRange("7376242AD236", "7376242AD245")},

		// S.No 106 - WW 008 - B.Tech. AL - 22AM403
		{HallNo: "WW 008", CourseCode: "22AM403", RegisterNos: []string{"7376222AL169"}},

		// S.No 107 - WW 008 - 22AM403
		{HallNo: "WW 008", CourseCode: "22AM403", RegisterNos: []string{
			"7376232AL104", "7376232AL125", "7376232AL157", "7376232AL183", "7376232AL217",
		}},

		// S.No 108 - WW 008 - B.Tech. AD - 22AI403
		{HallNo: "WW 008", CourseCode: "22AI403", RegisterNos: expandRange("7376242AD256", "7376242AD265")},

		// S.No 109 - WW 008 - B.Tech. AL - 22AM403
		{HallNo: "WW 008", CourseCode: "22AM403", RegisterNos: expandRange("7376242AL101", "7376242AL109")},

		// S.No 110 - WW 011 - B.Tech. AD - 22AI403
		{HallNo: "WW 011", CourseCode: "22AI403", RegisterNos: expandRange("7376242AD331", "7376242AD340")},

		// S.No 111 - WW 011 - B.Tech. AL - 22AM403
		{HallNo: "WW 011", CourseCode: "22AM403", RegisterNos: expandRange("7376242AL190", "7376242AL204")},

		// S.No 112 - WW 012 - B.Tech. BT - 22BT403
		{HallNo: "WW 012", CourseCode: "22BT403", RegisterNos: []string{
			"7376232BT115", "7376232BT142", "7376232BT152", "7376232BT192",
		}},

		// S.No 113 - WW 012 - B.Tech. AL - 22AM403
		{HallNo: "WW 012", CourseCode: "22AM403", RegisterNos: []string{
			"7376242AL501", "7376242AL503", "7376242AL505",
		}},

		// S.No 114 - WW 012 - B.Tech. BT - 22BT403
		{HallNo: "WW 012", CourseCode: "22BT403", RegisterNos: []string{"7376242BT102"}},

		// S.No 115 - WW 012 - B.Tech. AD - 22AI403
		{HallNo: "WW 012", CourseCode: "22AI403", RegisterNos: expandRange("7376252AD504", "7376252AD513")},

		// S.No 116 - WW 012 - B.Tech. AL - 22AM403
		{HallNo: "WW 012", CourseCode: "22AM403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AL220", "7376242AL223")...)
			r = append(r, expandRange("7376252AL501", "7376252AL503")...)
			return r
		}()},

		// S.No 117 - WW 113 - B.E. CS - 22CS403
		{HallNo: "WW 113", CourseCode: "22CS403", RegisterNos: expandRange("7376241CS198", "7376241CS212")},

		// S.No 118 - WW 113 - B.E. EC - 22EC403
		{HallNo: "WW 113", CourseCode: "22EC403", RegisterNos: expandRange("7376241EC123", "7376241EC132")},

		// S.No 119 - WW 114 - B.E. CS - 22CS403
		{HallNo: "WW 114", CourseCode: "22CS403", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241CS228")
			r = append(r, expandRange("7376241CS230", "7376241CS243")...)
			return r
		}()},

		// S.No 120 - WW 114 - B.E. EC - 22EC403
		{HallNo: "WW 114", CourseCode: "22EC403", RegisterNos: expandRange("7376241EC143", "7376241EC152")},

		// S.No 121 - WW 115 - B.E. CS - 22CS403
		{HallNo: "WW 115", CourseCode: "22CS403", RegisterNos: expandRange("7376241CS274", "7376241CS288")},

		// S.No 122 - WW 115 - B.E. EC - 22EC403
		{HallNo: "WW 115", CourseCode: "22EC403", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EC173", "7376241EC174")
			r = append(r, expandRange("7376241EC176", "7376241EC183")...)
			return r
		}()},

		// S.No 123 - WW 117 - B.E. CS - 22CS403
		{HallNo: "WW 117", CourseCode: "22CS403", RegisterNos: expandRange("7376241CS304", "7376241CS318")},

		// S.No 124 - WW 117 - B.E. EC - 22EC403
		{HallNo: "WW 117", CourseCode: "22EC403", RegisterNos: expandRange("7376241EC194", "7376241EC203")},

		// S.No 125 - WW 118 - B.E. CS - 22CS403
		{HallNo: "WW 118", CourseCode: "22CS403", RegisterNos: expandRange("7376241CS380", "7376241CS394")},

		// S.No 126 - WW 118 - B.E. EC - 22EC403
		{HallNo: "WW 118", CourseCode: "22EC403", RegisterNos: expandRange("7376241EC246", "7376241EC255")},

		// S.No 127 - WW 202 - B.E. CS - 22CS403
		{HallNo: "WW 202", CourseCode: "22CS403", RegisterNos: expandRange("7376241CS395", "7376241CS419")},

		// S.No 128 - WW 202 - B.E. EC - 22EC403
		{HallNo: "WW 202", CourseCode: "22EC403", RegisterNos: expandRange("7376241EC256", "7376241EC280")},

		// S.No 129 - WW 203 - B.E. CS - 22CS403
		{HallNo: "WW 203", CourseCode: "22CS403", RegisterNos: expandRange("7376241CS420", "7376241CS434")},

		// S.No 130 - WW 203 - B.E. EC - 22EC403
		{HallNo: "WW 203", CourseCode: "22EC403", RegisterNos: expandRange("7376241EC281", "7376241EC290")},

		// S.No 131 - WW 204 - B.Tech. IT - 22IT403
		{HallNo: "WW 204", CourseCode: "22IT403", RegisterNos: []string{"7376222IT110"}},

		// S.No 132 - WW 204 - 22IT403
		{HallNo: "WW 204", CourseCode: "22IT403", RegisterNos: []string{
			"7376232IT113", "7376232IT118", "7376232IT146", "7376232IT152",
			"7376232IT224", "7376232IT282",
		}},

		// S.No 133 - WW 204 - B.E. CS - 22CS403
		{HallNo: "WW 204", CourseCode: "22CS403", RegisterNos: expandRange("7376251CS520", "7376251CS524")},

		// S.No 134 - WW 204 - B.E. EC - 22EC403
		{HallNo: "WW 204", CourseCode: "22EC403", RegisterNos: expandRange("7376241EC331", "7376241EC340")},

		// S.No 135 - WW 204 - B.Tech. IT - 22IT403
		{HallNo: "WW 204", CourseCode: "22IT403", RegisterNos: expandRange("7376242IT101", "7376242IT103")},

		// S.No 136 - WW 205 - B.Tech. AD - 22AI403
		{HallNo: "WW 205", CourseCode: "22AI403", RegisterNos: []string{"7376232AD502"}},

		// S.No 137 - WW 205 - 22AI403
		{HallNo: "WW 205", CourseCode: "22AI403", RegisterNos: []string{"7376232AD282"}},

		// S.No 138 - WW 205 - B.Tech. IT - 22IT403
		{HallNo: "WW 205", CourseCode: "22IT403", RegisterNos: expandRange("7376242IT175", "7376242IT189")},

		// S.No 139 - WW 205 - B.Tech. AD - 22AI403
		{HallNo: "WW 205", CourseCode: "22AI403", RegisterNos: expandRange("7376242AD102", "7376242AD109")},

		// S.No 140 - WW 211 - B.E. CS - 22CS403
		{HallNo: "WW 211", CourseCode: "22CS403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS435", "7376241CS442")...)
			r = append(r, expandRange("7376241CS444", "7376241CS450")...)
			return r
		}()},

		// S.No 141 - WW 211 - B.E. EC - 22EC403
		{HallNo: "WW 211", CourseCode: "22EC403", RegisterNos: expandRange("7376241EC291", "7376241EC300")},

		// S.No 142 - WW 212 - B.E. CE - 22CE403
		{HallNo: "WW 212", CourseCode: "22CE403", RegisterNos: []string{"7376221CE124"}},

		// S.No 143 - WW 212 - B.Tech. FD - 22FD403
		{HallNo: "WW 212", CourseCode: "22FD403", RegisterNos: []string{"7376222FD107", "7376222FD125"}},

		// S.No 144 - WW 212 - B.Tech. AG - 22AG403
		{HallNo: "WW 212", CourseCode: "22AG403", RegisterNos: []string{"7376222AG120"}},

		// S.No 145 - WW 212 - B.E. CE - 22CE403
		{HallNo: "WW 212", CourseCode: "22CE403", RegisterNos: []string{"7376231CE117", "7376231CE120"}},

		// S.No 146 - WW 212 - B.E. BM - 22BM403
		{HallNo: "WW 212", CourseCode: "22BM403", RegisterNos: []string{
			"7376231BM107", "7376231BM132", "7376231BM134", "7376231BM137",
			"7376231BM146", "7376231BM148", "7376241BM501",
		}},

		// S.No 147 - WW 212 - B.Tech. FD - 22FD403
		{HallNo: "WW 212", CourseCode: "22FD403", RegisterNos: []string{"7376232FD137"}},

		// S.No 148 - WW 212 - B.Tech. AG - 22AG403
		{HallNo: "WW 212", CourseCode: "22AG403", RegisterNos: []string{"7376232AG151"}},

		// S.No 149 - WW 212 - B.E. ME - 22ME403
		{HallNo: "WW 212", CourseCode: "22ME403", RegisterNos: []string{"7376251ME508"}},

		// S.No 150 - WW 212 - B.Tech. AG - 22AG403
		{HallNo: "WW 212", CourseCode: "22AG403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AG101", "7376242AG124")...)
			r = append(r, "7376252AG501", "7376252AG502")
			return r
		}()},

		// S.No 151 - WW 213 - B.E. EC - 22EC403
		{HallNo: "WW 213", CourseCode: "22EC403", RegisterNos: expandRange("7376251EC509", "7376251EC518")},

		// S.No 152 - WW 213 - B.Tech. IT - 22IT403
		{HallNo: "WW 213", CourseCode: "22IT403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT149", "7376242IT153")...)
			r = append(r, expandRange("7376242IT155", "7376242IT164")...)
			return r
		}()},

		// S.No 153 - WW 214 - 22IT403
		{HallNo: "WW 214", CourseCode: "22IT403", RegisterNos: expandRange("7376242IT190", "7376242IT204")},

		// S.No 154 - WW 214 - B.Tech. AD - 22AI403
		{HallNo: "WW 214", CourseCode: "22AI403", RegisterNos: expandRange("7376242AD110", "7376242AD119")},

		// S.No 155 - WW 215 - B.Tech. IT - 22IT403
		{HallNo: "WW 215", CourseCode: "22IT403", RegisterNos: expandRange("7376242IT205", "7376242IT219")},

		// S.No 156 - WW 215 - B.Tech. AD - 22AI403
		{HallNo: "WW 215", CourseCode: "22AI403", RegisterNos: expandRange("7376242AD120", "7376242AD129")},

		// S.No 157 - WW 218 - B.E. EE - 22EE403
		{HallNo: "WW 218", CourseCode: "22EE403", RegisterNos: expandRange("7376241EE184", "7376241EE193")},

		// S.No 158 - WW 218 - B.E. MZ - 22MC403
		{HallNo: "WW 218", CourseCode: "22MC403", RegisterNos: []string{"7376241MZ101"}},

		// S.No 159 - WW 218 - B.Tech. BT - 22BT403
		{HallNo: "WW 218", CourseCode: "22BT403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242BT209", "7376242BT218")...)
			r = append(r, expandRange("7376242BT220", "7376242BT222")...)
			r = append(r, "7376252BT501")
			return r
		}()},

		// S.No 160 - WW 219 - B.E. EE - 22EE403
		{HallNo: "WW 219", CourseCode: "22EE403", RegisterNos: expandRange("7376241EE194", "7376241EE203")},

		// S.No 161 - WW 219 - B.E. MZ - 22MC403
		{HallNo: "WW 219", CourseCode: "22MC403", RegisterNos: expandRange("7376241MZ102", "7376241MZ116")},

		// S.No 162 - WW 222 - B.E. EE - 22EE403
		{HallNo: "WW 222", CourseCode: "22EE403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EE204", "7376241EE217")...)
			r = append(r, expandRange("7376251EE501", "7376251EE511")...)
			return r
		}()},

		// S.No 163 - WW 222 - B.E. MZ - 22MC403
		{HallNo: "WW 222", CourseCode: "22MC403", RegisterNos: expandRange("7376241MZ117", "7376241MZ141")},

		// S.No 164 - WW 223 - B.Tech. CB - 22CB403
		{HallNo: "WW 223", CourseCode: "22CB403", RegisterNos: []string{
			"7376222CB121", "7376232CB501", "7376232CB504", "7376232CB505",
		}},

		// S.No 165 - WW 223 - 22CB403
		{HallNo: "WW 223", CourseCode: "22CB403", RegisterNos: []string{
			"7376232CB106", "7376232CB110", "7376232CB111",
			"7376232CB123", "7376232CB133", "7376232CB145",
		}},

		// S.No 166 - WW 223 - B.E. EE - 22EE403
		{HallNo: "WW 223", CourseCode: "22EE403", RegisterNos: expandRange("7376251EE512", "7376251EE517")},

		// S.No 167 - WW 223 - B.E. MZ - 22MC403
		{HallNo: "WW 223", CourseCode: "22MC403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241MZ142", "7376241MZ160")...)
			r = append(r, expandRange("7376251MZ501", "7376251MZ506")...)
			return r
		}()},

		// S.No 168 - WW 223 - B.Tech. CB - 22CB403
		{HallNo: "WW 223", CourseCode: "22CB403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242CB102", "7376242CB105")...)
			r = append(r, expandRange("7376242CB107", "7376242CB111")...)
			return r
		}()},

		// S.No 169 - WW 224 - B.E. EI - 22EI403
		{HallNo: "WW 224", CourseCode: "22EI403", RegisterNos: []string{"7376231EI503"}},

		// S.No 170 - WW 224 - 22EI403
		{HallNo: "WW 224", CourseCode: "22EI403", RegisterNos: []string{
			"7376231EI128", "7376231EI143", "7376231EI159",
		}},

		// S.No 171 - WW 224 - 22EI403
		{HallNo: "WW 224", CourseCode: "22EI403", RegisterNos: expandRange("7376241EI101", "7376241EI121")},

		// S.No 172 - WW 224 - B.Tech. CB - 22CB403
		{HallNo: "WW 224", CourseCode: "22CB403", RegisterNos: expandRange("7376242CB112", "7376242CB136")},

		// S.No 173 - WW 225 - 22CB403
		{HallNo: "WW 225", CourseCode: "22CB403", RegisterNos: []string{"7376242CB502", "7376242CB503"}},

		// S.No 174 - WW 225 - B.E. EI - 22EI403
		{HallNo: "WW 225", CourseCode: "22EI403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EI122", "7376241EI125")...)
			r = append(r, expandRange("7376241EI127", "7376241EI147")...)
			return r
		}()},

		// S.No 175 - WW 225 - B.Tech. CB - 22CB403
		{HallNo: "WW 225", CourseCode: "22CB403", RegisterNos: expandRange("7376242CB137", "7376242CB159")},

		// S.No 176 - WW 226 - B.E. ME - 22ME403
		{HallNo: "WW 226", CourseCode: "22ME403", RegisterNos: []string{"7376221ME138"}},

		// S.No 177 - WW 226 - B.E. SE - 22IS403
		{HallNo: "WW 226", CourseCode: "22IS403", RegisterNos: []string{
			"7376221SE134", "7376221SE140", "7376231SE504",
		}},

		// S.No 178 - WW 226 - B.E. CD - 22CD403
		{HallNo: "WW 226", CourseCode: "22CD403", RegisterNos: []string{"7376221CD114"}},

		// S.No 179 - WW 226 - B.E. SE - 22IS403
		{HallNo: "WW 226", CourseCode: "22IS403", RegisterNos: []string{
			"7376231SE128", "7376231SE131", "7376231SE137", "7376231SE139", "7376231SE153",
		}},

		// S.No 180 - WW 226 - B.E. CD - 22CD403
		{HallNo: "WW 226", CourseCode: "22CD403", RegisterNos: []string{"7376231CD143"}},

		// S.No 181 - WW 226 - B.E. EI - 22EI403
		{HallNo: "WW 226", CourseCode: "22EI403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EI148", "7376241EI160")...)
			r = append(r, "7376251EI501", "7376251EI502")
			return r
		}()},

		// S.No 182 - WW 226 - B.E. ME - 22ME403
		{HallNo: "WW 226", CourseCode: "22ME403", RegisterNos: expandRange("7376241ME102", "7376241ME122")},

		// S.No 183 - WW 226 - B.Tech. CB - 22CB403
		{HallNo: "WW 226", CourseCode: "22CB403", RegisterNos: expandRange("7376252CB501", "7376252CB503")},

		// S.No 184 - WW 227 - B.E. BM - 22BM403
		{HallNo: "WW 227", CourseCode: "22BM403", RegisterNos: []string{"7376231BM502"}},

		// S.No 185 - WW 227 - B.E. CD - 22CD403
		{HallNo: "WW 227", CourseCode: "22CD403", RegisterNos: []string{"7376231CD503"}},

		// S.No 186 - WW 227 - 22CD403
		{HallNo: "WW 227", CourseCode: "22CD403", RegisterNos: []string{"7376241CD501", "7376241CD502"}},

		// S.No 187 - WW 227 - B.Tech. CT - 22CT403
		{HallNo: "WW 227", CourseCode: "22CT403", RegisterNos: []string{
			"7376232CT122", "7376232CT127", "7376242CT503",
		}},

		// S.No 188 - WW 227 - B.E. ME - 22ME403
		{HallNo: "WW 227", CourseCode: "22ME403", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241ME123", "7376241ME132")...)
			r = append(r, expandRange("7376241ME134", "7376241ME159")...)
			r = append(r, expandRange("7376251ME501", "7376251ME507")...)
			return r
		}()},
	}
}

// buildSeatingData14AN returns all seating records from the 14-05-2026 AN exam
// Exam Date: 14-05-2026 | Session: AN - 01:30 PM to 04:30 PM
func buildSeatingData14AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.E. EC - 22EC305
		{HallNo: "EW 101", CourseCode: "22EC305", RegisterNos: []string{"7376221EC107", "7376221EC337"}},

		// S.No 2 - EW 101 - B.Tech. IT - 22IT305
		{HallNo: "EW 101", CourseCode: "22IT305", RegisterNos: []string{"7376222IT110"}},

		// S.No 3 - EW 101 - B.E. EC - 22EC305
		{HallNo: "EW 101", CourseCode: "22EC305", RegisterNos: []string{
			"7376231EC110", "7376231EC112", "7376231EC283",
			"7376231EC305", "7376231EC331", "7376231EC334",
		}},

		// S.No 4 - EW 101 - B.Tech. IT - 22IT305
		{HallNo: "EW 101", CourseCode: "22IT305", RegisterNos: []string{
			"7376232IT118", "7376232IT152", "7376232IT282",
		}},

		// S.No 5 - EW 101 - B.E. EC - 22EC305
		{HallNo: "EW 101", CourseCode: "22EC305", RegisterNos: []string{
			"7376241EC124", "7376241EC137", "7376241EC138", "7376241EC139",
			"7376241EC157", "7376241EC201", "7376241EC243",
		}},

		// S.No 6 - EW 101 - B.Tech. IT - 22IT305
		{HallNo: "EW 101", CourseCode: "22IT305", RegisterNos: []string{
			"7376242IT129", "7376242IT141", "7376242IT146",
			"7376242IT164", "7376242IT168", "7376242IT184",
		}},

		// S.No 7 - EW 102 - B.E. EC - 22EC305
		{HallNo: "EW 102", CourseCode: "22EC305", RegisterNos: []string{"7376241EC516", "7376241EC521"}},

		// S.No 8 - EW 102 - 22EC305
		{HallNo: "EW 102", CourseCode: "22EC305", RegisterNos: []string{
			"7376241EC284", "7376241EC300", "7376241EC312",
			"7376251EC506", "7376251EC507", "7376251EC508",
			"7376251EC511", "7376251EC513", "7376251EC515",
			"7376251EC517", "7376251EC518", "7376251EC519", "7376251EC521",
		}},

		// S.No 9 - EW 102 - B.Tech. IT - 22IT305
		{HallNo: "EW 102", CourseCode: "22IT305", RegisterNos: []string{
			"7376242IT188", "7376242IT214", "7376242IT227", "7376242IT257",
			"7376242IT287", "7376242IT292", "7376252IT502", "7376252IT504",
			"7376252IT507", "7376252IT511",
		}},

		// S.No 10 - EW 103 - B.Tech. BT - 22BT305
		{HallNo: "EW 103", CourseCode: "22BT305", RegisterNos: []string{"7376222BT110"}},

		// S.No 11 - EW 103 - B.E. MZ - 22MC305
		{HallNo: "EW 103", CourseCode: "22MC305", RegisterNos: []string{
			"7376231MZ106", "7376231MZ111", "7376231MZ113",
			"7376231MZ135", "7376231MZ143", "7376231MZ148",
		}},

		// S.No 12 - EW 103 - B.Tech. BT - 22BT305
		{HallNo: "EW 103", CourseCode: "22BT305", RegisterNos: []string{"7376232BT152", "7376232BT176"}},

		// S.No 13 - EW 103 - B.Tech. CB - 22CB305
		{HallNo: "EW 103", CourseCode: "22CB305", RegisterNos: []string{"7376232CB110", "7376232CB111"}},

		// S.No 14 - EW 103 - B.E. MZ - 22MC305
		{HallNo: "EW 103", CourseCode: "22MC305", RegisterNos: []string{"7376241MZ124", "7376241MZ139"}},

		// S.No 15 - EW 103 - B.Tech. BT - 22BT305
		{HallNo: "EW 103", CourseCode: "22BT305", RegisterNos: []string{
			"7376242BT120", "7376242BT138", "7376242BT145", "7376242BT151",
			"7376242BT156", "7376242BT160", "7376242BT174", "7376242BT178",
			"7376242BT220", "7376252BT501",
		}},

		// S.No 16 - EW 103 - B.Tech. IT - 22IT305
		{HallNo: "EW 103", CourseCode: "22IT305", RegisterNos: []string{"7376252IT512", "7376252IT515"}},

		// S.No 17 - EW 104 - B.Tech. AD - 22AI305
		{HallNo: "EW 104", CourseCode: "22AI305", RegisterNos: []string{"7376232AD502"}},

		// S.No 18 - EW 104 - B.E. CS - 22CS305
		{HallNo: "EW 104", CourseCode: "22CS305", RegisterNos: []string{
			"7376231CS244", "7376231CS259", "7376231CS292",
		}},

		// S.No 19 - EW 104 - B.E. MZ - 22MC305
		{HallNo: "EW 104", CourseCode: "22MC305", RegisterNos: []string{"7376241MZ501", "7376241MZ504"}},

		// S.No 20 - EW 104 - B.Tech. CB - 22CB305
		{HallNo: "EW 104", CourseCode: "22CB305", RegisterNos: []string{"7376232CB123"}},

		// S.No 21 - EW 104 - B.E. CS - 22CS305
		{HallNo: "EW 104", CourseCode: "22CS305", RegisterNos: []string{
			"7376241CS230", "7376241CS272", "7376241CS318", "7376241CS395",
		}},

		// S.No 22 - EW 104 - B.E. MZ - 22MC305
		{HallNo: "EW 104", CourseCode: "22MC305", RegisterNos: []string{"7376241MZ143", "7376251MZ506"}},

		// S.No 23 - EW 104 - B.Tech. CB - 22CB305
		{HallNo: "EW 104", CourseCode: "22CB305", RegisterNos: []string{
			"7376242CB116", "7376242CB118", "7376242CB121",
			"7376242CB155", "7376242CB157", "7376252CB502",
		}},

		// S.No 24 - EW 104 - B.Tech. AD - 22AI305
		{HallNo: "EW 104", CourseCode: "22AI305", RegisterNos: []string{
			"7376242AD137", "7376242AD189", "7376242AD190",
			"7376242AD218", "7376242AD320",
		}},

		// S.No 25 - EW 104 - B.Tech. AL - 22AM305
		{HallNo: "EW 104", CourseCode: "22AM305", RegisterNos: []string{"7376242AL108"}},

		// S.No 26 - EW 105 - B.E. CE - 22CE305
		{HallNo: "EW 105", CourseCode: "22CE305", RegisterNos: []string{"7376221CE124"}},

		// S.No 27 - EW 105 - B.E. EI - 22EI305
		{HallNo: "EW 105", CourseCode: "22EI305", RegisterNos: []string{"7376231EI501", "7376231EI503"}},

		// S.No 28 - EW 105 - B.E. CE - 22CE305
		{HallNo: "EW 105", CourseCode: "22CE305", RegisterNos: []string{
			"7376231CE120", "7376241CE501", "7376241CE502", "7376241CE504",
		}},

		// S.No 29 - EW 105 - B.E. ME - 22ME305
		{HallNo: "EW 105", CourseCode: "22ME305", RegisterNos: []string{"7376231ME149", "7376241ME501"}},

		// S.No 30 - EW 105 - B.E. BM - 22BM305
		{HallNo: "EW 105", CourseCode: "22BM305", RegisterNos: []string{"7376231BM107", "7376241BM501"}},

		// S.No 31 - EW 105 - B.Tech. CT - 22CT305
		{HallNo: "EW 105", CourseCode: "22CT305", RegisterNos: []string{"7376232CT122", "7376242CT503"}},

		// S.No 32 - EW 105 - B.Tech. AL - 22AM305
		{HallNo: "EW 105", CourseCode: "22AM305", RegisterNos: []string{"7376242AL501"}},

		// S.No 33 - EW 105 - B.E. EE - 22EE305
		{HallNo: "EW 105", CourseCode: "22EE305", RegisterNos: []string{"7376251EE514"}},

		// S.No 34 - EW 105 - B.E. EI - 22EI305
		{HallNo: "EW 105", CourseCode: "22EI305", RegisterNos: []string{"7376241EI160", "7376251EI502"}},

		// S.No 35 - EW 105 - B.E. ME - 22ME305
		{HallNo: "EW 105", CourseCode: "22ME305", RegisterNos: []string{
			"7376241ME123", "7376241ME124", "7376241ME127", "7376251ME503",
		}},

		// S.No 36 - EW 105 - B.Tech. AD - 22AI305
		{HallNo: "EW 105", CourseCode: "22AI305", RegisterNos: []string{"7376252AD510"}},

		// S.No 37 - EW 105 - B.Tech. AL - 22AM305
		{HallNo: "EW 105", CourseCode: "22AM305", RegisterNos: []string{
			"7376242AL157", "7376242AL197", "7376242AL207",
		}},

		// S.No 38 - EW 106 - B.E. CD - 22CD305
		{HallNo: "EW 106", CourseCode: "22CD305", RegisterNos: []string{"7376221CD114"}},

		// S.No 39 - EW 106 - B.Tech. FD - 22FD305
		{HallNo: "EW 106", CourseCode: "22FD305", RegisterNos: []string{"7376222FD107", "7376222FD125"}},

		// S.No 40 - EW 106 - B.E. SE - 22IS305
		{HallNo: "EW 106", CourseCode: "22IS305", RegisterNos: []string{"7376231SE144"}},

		// S.No 41 - EW 106 - B.E. CD - 22CD305
		{HallNo: "EW 106", CourseCode: "22CD305", RegisterNos: []string{"7376241CD501"}},

		// S.No 42 - EW 106 - B.Tech. AG - 22AG305
		{HallNo: "EW 106", CourseCode: "22AG305", RegisterNos: []string{"7376232AG113", "7376232AG151"}},
	}
}
// buildSeatingData15FN returns all seating records from the 15-05-2026 FN exam
// Exam Date: 15-05-2026 | Session: FN - 09:00 AM to 12:00 PM
func buildSeatingData15FN() []models.SeatingRecord {
	return []models.SeatingRecord{

		// S.No 1 - AE 302 - B.E. CS - 22CS603
		{HallNo: "AE 302", CourseCode: "22CS603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS156", "7376231CS166")...)
			r = append(r, expandRange("7376231CS168", "7376231CS171")...)
			return r
		}()},

		// S.No 2 - AE 302 - B.E. EC - 22EC603
		{HallNo: "AE 302", CourseCode: "22EC603", RegisterNos: expandRange("7376231EC139", "7376231EC148")},

		// S.No 3 - EW 101 - B.E. CS - 22CS603
		{HallNo: "EW 101", CourseCode: "22CS603", RegisterNos: expandRange("7376231CS172", "7376231CS186")},

		// S.No 4 - EW 101 - B.E. EC - 22EC603
		{HallNo: "EW 101", CourseCode: "22EC603", RegisterNos: expandRange("7376231EC149", "7376231EC158")},

		// S.No 5 - EW 102 - B.E. CS - 22CS603
		{HallNo: "EW 102", CourseCode: "22CS603", RegisterNos: expandRange("7376231CS187", "7376231CS201")},

		// S.No 6 - EW 102 - B.E. EC - 22EC603
		{HallNo: "EW 102", CourseCode: "22EC603", RegisterNos: expandRange("7376231EC159", "7376231EC168")},

		// S.No 7 - EW 103 - B.E. CS - 22CS603
		{HallNo: "EW 103", CourseCode: "22CS603", RegisterNos: expandRange("7376231CS247", "7376231CS261")},

		// S.No 8 - EW 103 - B.E. EC - 22EC603
		{HallNo: "EW 103", CourseCode: "22EC603", RegisterNos: expandRange("7376231EC199", "7376231EC208")},

		// S.No 9 - EW 104 - B.E. CS - 22CS603
		{HallNo: "EW 104", CourseCode: "22CS603", RegisterNos: expandRange("7376231CS340", "7376231CS354")},

		// S.No 10 - EW 104 - B.E. EC - 22EC603
		{HallNo: "EW 104", CourseCode: "22EC603", RegisterNos: expandRange("7376231EC259", "7376231EC268")},

		// S.No 11 - EW 105 - B.E. CS - 22CS603
		{HallNo: "EW 105", CourseCode: "22CS603", RegisterNos: expandRange("7376241CS501", "7376241CS515")},

		// S.No 12 - EW 105 - B.E. EC - 22EC603
		{HallNo: "EW 105", CourseCode: "22EC603", RegisterNos: expandRange("7376231EC269", "7376231EC278")},

		// S.No 13 - EW 106 - B.Tech. IT - 22IT603
		{HallNo: "EW 106", CourseCode: "22IT603", RegisterNos: []string{"7376222IT110"}},

		// S.No 14 - EW 106 - B.E. EC - 22EC603
		{HallNo: "EW 106", CourseCode: "22EC603", RegisterNos: expandRange("7376241EC520", "7376241EC522")},

		// S.No 15 - EW 106 - B.Tech. IT - 22IT603
		{HallNo: "EW 106", CourseCode: "22IT603", RegisterNos: expandRange("7376232IT101", "7376232IT106")},

		// S.No 16 - EW 106 - B.Tech. AD - 22AI603
		{HallNo: "EW 106", CourseCode: "22AI603", RegisterNos: expandRange("7376232AD198", "7376232AD212")},

		// S.No 17 - EW 107 - B.E. CS - 22CS603
		{HallNo: "EW 107", CourseCode: "22CS603", RegisterNos: expandRange("7376231CS217", "7376231CS231")},

		// S.No 18 - EW 107 - B.E. EC - 22EC603
		{HallNo: "EW 107", CourseCode: "22EC603", RegisterNos: expandRange("7376231EC179", "7376231EC188")},

		// S.No 19 - EW 108 - B.E. CS - 22CS603
		{HallNo: "EW 108", CourseCode: "22CS603", RegisterNos: expandRange("7376231CS262", "7376231CS276")},

		// S.No 20 - EW 108 - B.E. EC - 22EC603
		{HallNo: "EW 108", CourseCode: "22EC603", RegisterNos: expandRange("7376231EC209", "7376231EC218")},

		// S.No 21 - EW 109 - B.E. CS - 22CS603
		{HallNo: "EW 109", CourseCode: "22CS603", RegisterNos: expandRange("7376231CS293", "7376231CS307")},

		// S.No 22 - EW 109 - B.E. EC - 22EC603
		{HallNo: "EW 109", CourseCode: "22EC603", RegisterNos: expandRange("7376231EC229", "7376231EC238")},

		// S.No 23 - EW 111 - B.E. CS - 22CS603
		{HallNo: "EW 111", CourseCode: "22CS603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS324", "7376231CS326")...)
			r = append(r, expandRange("7376231CS328", "7376231CS339")...)
			return r
		}()},

		// S.No 24 - EW 111 - B.E. EC - 22EC603
		{HallNo: "EW 111", CourseCode: "22EC603", RegisterNos: expandRange("7376231EC249", "7376231EC258")},

		// S.No 25 - EW 112 - B.E. CS - 22CS603
		{HallNo: "EW 112", CourseCode: "22CS603", RegisterNos: []string{
			"7376241CS516", "7376241CS518", "7376241CS519",
		}},

		// S.No 26 - EW 112 - B.E. EC - 22EC603
		{HallNo: "EW 112", CourseCode: "22EC603", RegisterNos: expandRange("7376231EC279", "7376231EC288")},

		// S.No 27 - EW 112 - B.Tech. AD - 22AI603
		{HallNo: "EW 112", CourseCode: "22AI603", RegisterNos: expandRange("7376232AD101", "7376232AD112")},

		// S.No 28 - EW 113 - B.Tech. IT - 22IT603
		{HallNo: "EW 113", CourseCode: "22IT603", RegisterNos: expandRange("7376232IT254", "7376232IT263")},

		// S.No 29 - EW 113 - B.Tech. AL - 22AM603
		{HallNo: "EW 113", CourseCode: "22AM603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AL212", "7376232AL221")...)
			r = append(r, expandRange("7376242AL501", "7376242AL505")...)
			return r
		}()},

		// S.No 30 - EW 114 - B.E. EE - 22EE603
		{HallNo: "EW 114", CourseCode: "22EE603", RegisterNos: expandRange("7376231EE102", "7376231EE115")},

		// S.No 31 - EW 114 - B.E. ME - 22ME603
		{HallNo: "EW 114", CourseCode: "22ME603", RegisterNos: []string{"7376241ME505"}},

		// S.No 32 - EW 114 - B.Tech. BT - 22BT603
		{HallNo: "EW 114", CourseCode: "22BT603", RegisterNos: expandRange("7376232BT117", "7376232BT126")},

		// S.No 33 - EW 115 - B.E. EE - 22EE603
		{HallNo: "EW 115", CourseCode: "22EE603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EE151", "7376231EE161")...)
			r = append(r, expandRange("7376241EE501", "7376241EE504")...)
			return r
		}()},

		// S.No 34 - EW 115 - B.Tech. BT - 22BT603
		{HallNo: "EW 115", CourseCode: "22BT603", RegisterNos: expandRange("7376232BT164", "7376232BT173")},

		// S.No 35 - EW 116 - B.Tech. CB - 22CB603
		{HallNo: "EW 116", CourseCode: "22CB603", RegisterNos: []string{"7376222CB121"}},

		// S.No 36 - EW 116 - B.E. EE - 22EE603
		{HallNo: "EW 116", CourseCode: "22EE603", RegisterNos: []string{"7376241EE505", "7376241EE506"}},

		// S.No 37 - EW 116 - B.Tech. BT - 22BT603
		{HallNo: "EW 116", CourseCode: "22BT603", RegisterNos: expandRange("7376232BT174", "7376232BT183")},

		// S.No 38 - EW 116 - B.Tech. CB - 22CB603
		{HallNo: "EW 116", CourseCode: "22CB603", RegisterNos: expandRange("7376232CB101", "7376232CB112")},

		// S.No 39 - EW 117 - B.Tech. BT - 22BT603
		{HallNo: "EW 117", CourseCode: "22BT603", RegisterNos: expandRange("7376232BT195", "7376232BT204")},

		// S.No 40 - EW 117 - B.Tech. CB - 22CB603
		{HallNo: "EW 117", CourseCode: "22CB603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232CB128", "7376232CB137")...)
			r = append(r, expandRange("7376232CB139", "7376232CB143")...)
			return r
		}()},

		// S.No 41 - EW 118 - B.E. CD - 22CD603
		{HallNo: "EW 118", CourseCode: "22CD603", RegisterNos: []string{
			"7376221CD114", "7376221CD126", "7376221CD144",
		}},

		// S.No 42 - EW 118 - 22CD603
		{HallNo: "EW 118", CourseCode: "22CD603", RegisterNos: expandRange("7376231CD102", "7376231CD107")},

		// S.No 43 - EW 118 - B.E. MZ - 22MC603
		{HallNo: "EW 118", CourseCode: "22MC603", RegisterNos: expandRange("7376231MZ101", "7376231MZ109")},

		// S.No 44 - EW 118 - B.Tech. BT - 22BT603
		{HallNo: "EW 118", CourseCode: "22BT603", RegisterNos: []string{"7376232BT215"}},

		// S.No 45 - EW 118 - B.Tech. CB - 22CB603
		{HallNo: "EW 118", CourseCode: "22CB603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232CB160", "7376232CB163")...)
			r = append(r, "7376242CB502", "7376242CB503")
			return r
		}()},

		// S.No 46 - EW 201 - B.Tech. IT - 22IT603
		{HallNo: "EW 201", CourseCode: "22IT603", RegisterNos: expandRange("7376232IT127", "7376232IT136")},

		// S.No 47 - EW 201 - B.Tech. AD - 22AI603
		{HallNo: "EW 201", CourseCode: "22AI603", RegisterNos: expandRange("7376232AD243", "7376232AD257")},

		// S.No 48 - EW 202 - B.Tech. AD - 22AI603
		{HallNo: "EW 202", CourseCode: "22AI603", RegisterNos: []string{"7376232AD502"}},

		// S.No 49 - EW 202 - B.Tech. IT - 22IT603
		{HallNo: "EW 202", CourseCode: "22IT603", RegisterNos: expandRange("7376232IT147", "7376232IT156")},

		// S.No 50 - EW 202 - B.Tech. AD - 22AI603
		{HallNo: "EW 202", CourseCode: "22AI603", RegisterNos: expandRange("7376232AD273", "7376232AD286")},

		// S.No 51 - EW 203 - B.E. ME - 22ME603
		{HallNo: "EW 203", CourseCode: "22ME603", RegisterNos: []string{"7376221ME138", "7376221ME154"}},

		// S.No 52 - EW 203 - 22ME603
		{HallNo: "EW 203", CourseCode: "22ME603", RegisterNos: expandRange("7376231ME101", "7376231ME111")},

		// S.No 53 - EW 203 - B.Tech. IT - 22IT603
		{HallNo: "EW 203", CourseCode: "22IT603", RegisterNos: expandRange("7376232IT264", "7376232IT273")},

		// S.No 54 - EW 203 - B.Tech. AL - 22AM603
		{HallNo: "EW 203", CourseCode: "22AM603", RegisterNos: []string{"7376242AL506", "7376242AL507"}},

		// S.No 55 - EW 204 - B.Tech. BT - 22BT603
		{HallNo: "EW 204", CourseCode: "22BT603", RegisterNos: []string{"7376222BT110", "7376222BT152"}},

		// S.No 56 - EW 204 - B.E. ME - 22ME603
		{HallNo: "EW 204", CourseCode: "22ME603", RegisterNos: expandRange("7376231ME142", "7376231ME151")},

		// S.No 57 - EW 204 - B.Tech. BT - 22BT603
		{HallNo: "EW 204", CourseCode: "22BT603", RegisterNos: expandRange("7376232BT101", "7376232BT106")},

		// S.No 58 - EW 204 - B.Tech. IT - 22IT603
		{HallNo: "EW 204", CourseCode: "22IT603", RegisterNos: []string{"7376242IT510", "7376242IT511"}},

		// S.No 59 - EW 205 - B.E. EE - 22EE603
		{HallNo: "EW 205", CourseCode: "22EE603", RegisterNos: expandRange("7376231EE116", "7376231EE125")},

		// S.No 60 - EW 205 - B.Tech. BT - 22BT603
		{HallNo: "EW 205", CourseCode: "22BT603", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232BT127")
			r = append(r, expandRange("7376232BT129", "7376232BT137")...)
			return r
		}()},

		// S.No 61 - EW 206 - B.E. EE - 22EE603
		{HallNo: "EW 206", CourseCode: "22EE603", RegisterNos: expandRange("7376231EE126", "7376231EE150")},

		// S.No 62 - EW 206 - B.Tech. BT - 22BT603
		{HallNo: "EW 206", CourseCode: "22BT603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232BT138", "7376232BT149")...)
			r = append(r, expandRange("7376232BT151", "7376232BT163")...)
			return r
		}()},

		// S.No 63 - EW 207 - B.E. EC - 22EC603
		{HallNo: "EW 207", CourseCode: "22EC603", RegisterNos: expandRange("7376241EC510", "7376241EC519")},

		// S.No 64 - EW 207 - B.Tech. AD - 22AI603
		{HallNo: "EW 207", CourseCode: "22AI603", RegisterNos: expandRange("7376232AD183", "7376232AD197")},

		// S.No 65 - EW 208 - B.Tech. IT - 22IT603
		{HallNo: "EW 208", CourseCode: "22IT603", RegisterNos: expandRange("7376232IT107", "7376232IT116")},

		// S.No 66 - EW 208 - B.Tech. AD - 22AI603
		{HallNo: "EW 208", CourseCode: "22AI603", RegisterNos: expandRange("7376232AD213", "7376232AD227")},

		// S.No 67 - EW 209 - B.Tech. IT - 22IT603
		{HallNo: "EW 209", CourseCode: "22IT603", RegisterNos: expandRange("7376232IT137", "7376232IT146")},

		// S.No 68 - EW 209 - B.Tech. AD - 22AI603
		{HallNo: "EW 209", CourseCode: "22AI603", RegisterNos: expandRange("7376232AD258", "7376232AD272")},

		// S.No 69 - EW 210 - B.Tech. IT - 22IT603
		{HallNo: "EW 210", CourseCode: "22IT603", RegisterNos: expandRange("7376232IT168", "7376232IT177")},

		// S.No 70 - EW 210 - B.Tech. AL - 22AM603
		{HallNo: "EW 210", CourseCode: "22AM603", RegisterNos: expandRange("7376232AL106", "7376232AL115")},

		// S.No 71 - EW 211 - B.Tech. IT - 22IT603
		{HallNo: "EW 211", CourseCode: "22IT603", RegisterNos: expandRange("7376232IT208", "7376232IT217")},

		// S.No 72 - EW 211 - B.Tech. AL - 22AM603
		{HallNo: "EW 211", CourseCode: "22AM603", RegisterNos: expandRange("7376232AL161", "7376232AL170")},

		// S.No 73 - EW 212 - B.Tech. IT - 22IT603
		{HallNo: "EW 212", CourseCode: "22IT603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232IT218", "7376232IT226")...)
			r = append(r, expandRange("7376232IT228", "7376232IT243")...)
			return r
		}()},

		// S.No 74 - EW 212 - B.Tech. AL - 22AM603
		{HallNo: "EW 212", CourseCode: "22AM603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AL171", "7376232AL193")...)
			r = append(r, "7376232AL195", "7376232AL196")
			return r
		}()},

		// S.No 75 - EW 213 - B.E. CD - 22CD603
		{HallNo: "EW 213", CourseCode: "22CD603", RegisterNos: expandRange("7376231CD108", "7376231CD117")},

		// S.No 76 - EW 213 - B.E. MZ - 22MC603
		{HallNo: "EW 213", CourseCode: "22MC603", RegisterNos: expandRange("7376231MZ110", "7376231MZ124")},

		// S.No 77 - EW 214 - B.E. CD - 22CD603
		{HallNo: "EW 214", CourseCode: "22CD603", RegisterNos: expandRange("7376231CD118", "7376231CD127")},

		// S.No 78 - EW 214 - B.E. MZ - 22MC603
		{HallNo: "EW 214", CourseCode: "22MC603", RegisterNos: expandRange("7376231MZ125", "7376231MZ139")},

		// S.No 79 - EW 215 - B.E. CD - 22CD603
		{HallNo: "EW 215", CourseCode: "22CD603", RegisterNos: expandRange("7376231CD128", "7376231CD137")},

		// S.No 80 - EW 215 - B.E. MZ - 22MC603
		{HallNo: "EW 215", CourseCode: "22MC603", RegisterNos: expandRange("7376231MZ140", "7376231MZ154")},

		// S.No 81 - EW 218 - B.Tech. AG - 22AG603
		{HallNo: "EW 218", CourseCode: "22AG603", RegisterNos: []string{"7376222AG120", "7376222AG158"}},

		// S.No 82 - EW 218 - B.E. CD - 22CD603
		{HallNo: "EW 218", CourseCode: "22CD603", RegisterNos: expandRange("7376231CD138", "7376231CD162")},

		// S.No 83 - EW 218 - B.E. MZ - 22MC603
		{HallNo: "EW 218", CourseCode: "22MC603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231MZ155", "7376231MZ158")...)
			r = append(r, expandRange("7376241MZ501", "7376241MZ506")...)
			return r
		}()},

		// S.No 84 - EW 218 - B.Tech. AG - 22AG603
		{HallNo: "EW 218", CourseCode: "22AG603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AG102", "7376232AG109")...)
			r = append(r, expandRange("7376232AG111", "7376232AG115")...)
			return r
		}()},

		// S.No 85 - MH 301 - B.E. CS - 22CS603
		{HallNo: "MH 301", CourseCode: "22CS603", RegisterNos: []string{
			"7376221CS109", "7376221CS118", "7376221CS140",
			"7376221CS196", "7376221CS288",
		}},

		// S.No 86 - MH 301 - B.E. EC - 22EC603
		{HallNo: "MH 301", CourseCode: "22EC603", RegisterNos: []string{"7376221EC107", "7376221EC226"}},

		// S.No 87 - MH 301 - B.E. CS - 22CS603
		{HallNo: "MH 301", CourseCode: "22CS603", RegisterNos: expandRange("7376231CS101", "7376231CS110")},

		// S.No 88 - MH 301 - B.E. EC - 22EC603
		{HallNo: "MH 301", CourseCode: "22EC603", RegisterNos: expandRange("7376231EC101", "7376231EC108")},

		// S.No 89 - MH 302 - B.E. CS - 22CS603
		{HallNo: "MH 302", CourseCode: "22CS603", RegisterNos: expandRange("7376231CS111", "7376231CS125")},

		// S.No 90 - MH 302 - B.E. EC - 22EC603
		{HallNo: "MH 302", CourseCode: "22EC603", RegisterNos: expandRange("7376231EC109", "7376231EC118")},

		// S.No 91 - MH 303 - B.E. CS - 22CS603
		{HallNo: "MH 303", CourseCode: "22CS603", RegisterNos: expandRange("7376231CS126", "7376231CS140")},

		// S.No 92 - MH 303 - B.E. EC - 22EC603
		{HallNo: "MH 303", CourseCode: "22EC603", RegisterNos: expandRange("7376231EC119", "7376231EC128")},

		// S.No 93 - MH 305 - B.E. CS - 22CS603
		{HallNo: "MH 305", CourseCode: "22CS603", RegisterNos: expandRange("7376231CS141", "7376231CS155")},

		// S.No 94 - MH 305 - B.E. EC - 22EC603
		{HallNo: "MH 305", CourseCode: "22EC603", RegisterNos: expandRange("7376231EC129", "7376231EC138")},

		// S.No 95 - WW 005 - B.Tech. IT - 22IT603
		{HallNo: "WW 005", CourseCode: "22IT603", RegisterNos: expandRange("7376232IT244", "7376232IT253")},

		// S.No 96 - WW 005 - B.Tech. AL - 22AM603
		{HallNo: "WW 005", CourseCode: "22AM603", RegisterNos: expandRange("7376232AL197", "7376232AL211")},

		// S.No 97 - WW 006 - B.E. ME - 22ME603
		{HallNo: "WW 006", CourseCode: "22ME603", RegisterNos: expandRange("7376231ME112", "7376231ME126")},

		// S.No 98 - WW 006 - B.Tech. IT - 22IT603
		{HallNo: "WW 006", CourseCode: "22IT603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232IT274", "7376232IT281")...)
			r = append(r, "7376232IT283", "7376232IT284")
			return r
		}()},

		// S.No 99 - WW 007 - B.E. ME - 22ME603
		{HallNo: "WW 007", CourseCode: "22ME603", RegisterNos: expandRange("7376231ME127", "7376231ME141")},

		// S.No 100 - WW 007 - B.Tech. IT - 22IT603
		{HallNo: "WW 007", CourseCode: "22IT603", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232IT285", "7376232IT286")
			r = append(r, expandRange("7376242IT501", "7376242IT505")...)
			r = append(r, expandRange("7376242IT507", "7376242IT509")...)
			return r
		}()},

		// S.No 101 - WW 008 - B.E. ME - 22ME603
		{HallNo: "WW 008", CourseCode: "22ME603", RegisterNos: []string{"7376231ME503"}},

		// S.No 102 - WW 008 - 22ME603
		{HallNo: "WW 008", CourseCode: "22ME603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231ME152", "7376231ME161")...)
			r = append(r, expandRange("7376241ME501", "7376241ME504")...)
			return r
		}()},

		// S.No 103 - WW 008 - B.Tech. BT - 22BT603
		{HallNo: "WW 008", CourseCode: "22BT603", RegisterNos: expandRange("7376232BT107", "7376232BT116")},

		// S.No 104 - WW 011 - 22BT603
		{HallNo: "WW 011", CourseCode: "22BT603", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376232BT184", "7376232BT185")
			r = append(r, expandRange("7376232BT187", "7376232BT194")...)
			return r
		}()},

		// S.No 105 - WW 011 - B.Tech. CB - 22CB603
		{HallNo: "WW 011", CourseCode: "22CB603", RegisterNos: expandRange("7376232CB113", "7376232CB127")},

		// S.No 106 - WW 012 - B.Tech. BT - 22BT603
		{HallNo: "WW 012", CourseCode: "22BT603", RegisterNos: expandRange("7376232BT205", "7376232BT214")},

		// S.No 107 - WW 012 - B.Tech. CB - 22CB603
		{HallNo: "WW 012", CourseCode: "22CB603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232CB144", "7376232CB157")...)
			r = append(r, "7376232CB159")
			return r
		}()},

		// S.No 108 - WW 113 - B.E. CS - 22CS603
		{HallNo: "WW 113", CourseCode: "22CS603", RegisterNos: expandRange("7376231CS202", "7376231CS216")},

		// S.No 109 - WW 113 - B.E. EC - 22EC603
		{HallNo: "WW 113", CourseCode: "22EC603", RegisterNos: expandRange("7376231EC169", "7376231EC178")},

		// S.No 110 - WW 114 - B.E. CS - 22CS603
		{HallNo: "WW 114", CourseCode: "22CS603", RegisterNos: expandRange("7376231CS232", "7376231CS246")},

		// S.No 111 - WW 114 - B.E. EC - 22EC603
		{HallNo: "WW 114", CourseCode: "22EC603", RegisterNos: expandRange("7376231EC189", "7376231EC198")},

		// S.No 112 - WW 115 - B.E. CS - 22CS603
		{HallNo: "WW 115", CourseCode: "22CS603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS277", "7376231CS287")...)
			r = append(r, expandRange("7376231CS289", "7376231CS292")...)
			return r
		}()},

		// S.No 113 - WW 115 - B.E. EC - 22EC603
		{HallNo: "WW 115", CourseCode: "22EC603", RegisterNos: expandRange("7376231EC219", "7376231EC228")},

		// S.No 114 - WW 117 - B.E. CS - 22CS603
		{HallNo: "WW 117", CourseCode: "22CS603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231CS308", "7376231CS321")...)
			r = append(r, "7376231CS323")
			return r
		}()},

		// S.No 115 - WW 117 - B.E. EC - 22EC603
		{HallNo: "WW 117", CourseCode: "22EC603", RegisterNos: expandRange("7376231EC239", "7376231EC248")},

		// S.No 116 - WW 118 - 22EC603
		{HallNo: "WW 118", CourseCode: "22EC603", RegisterNos: expandRange("7376231EC289", "7376231EC298")},

		// S.No 117 - WW 118 - B.Tech. AD - 22AI603
		{HallNo: "WW 118", CourseCode: "22AI603", RegisterNos: expandRange("7376232AD113", "7376232AD127")},

		// S.No 118 - WW 202 - B.E. EC - 22EC603
		{HallNo: "WW 202", CourseCode: "22EC603", RegisterNos: expandRange("7376231EC299", "7376231EC323")},

		// S.No 119 - WW 202 - B.Tech. AD - 22AI603
		{HallNo: "WW 202", CourseCode: "22AI603", RegisterNos: expandRange("7376232AD128", "7376232AD152")},

		// S.No 120 - WW 203 - B.E. EC - 22EC603
		{HallNo: "WW 203", CourseCode: "22EC603", RegisterNos: expandRange("7376231EC324", "7376231EC333")},

		// S.No 121 - WW 203 - B.Tech. AD - 22AI603
		{HallNo: "WW 203", CourseCode: "22AI603", RegisterNos: expandRange("7376232AD153", "7376232AD167")},

		// S.No 122 - WW 204 - B.Tech. IT - 22IT603
		{HallNo: "WW 204", CourseCode: "22IT603", RegisterNos: expandRange("7376232IT117", "7376232IT126")},

		// S.No 123 - WW 204 - B.Tech. AD - 22AI603
		{HallNo: "WW 204", CourseCode: "22AI603", RegisterNos: expandRange("7376232AD228", "7376232AD242")},

		// S.No 124 - WW 205 - B.Tech. IT - 22IT603
		{HallNo: "WW 205", CourseCode: "22IT603", RegisterNos: expandRange("7376232IT178", "7376232IT187")},

		// S.No 125 - WW 205 - B.Tech. AL - 22AM603
		{HallNo: "WW 205", CourseCode: "22AM603", RegisterNos: expandRange("7376232AL116", "7376232AL130")},

		// S.No 126 - WW 211 - B.E. EC - 22EC603
		{HallNo: "WW 211", CourseCode: "22EC603", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231EC334")
			r = append(r, expandRange("7376241EC501", "7376241EC509")...)
			return r
		}()},

		// S.No 127 - WW 211 - B.Tech. AD - 22AI603
		{HallNo: "WW 211", CourseCode: "22AI603", RegisterNos: expandRange("7376232AD168", "7376232AD182")},

		// S.No 128 - WW 212 - B.E. CE - 22CE603
		{HallNo: "WW 212", CourseCode: "22CE603", RegisterNos: []string{"7376221CE124"}},

		// S.No 129 - WW 212 - 22CE603
		{HallNo: "WW 212", CourseCode: "22CE603", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376231CE101")
			r = append(r, expandRange("7376231CE103", "7376231CE129")...)
			r = append(r, expandRange("7376241CE501", "7376241CE504")...)
			return r
		}()},

		// S.No 130 - WW 212 - B.Tech. FD - 22FD603
		{HallNo: "WW 212", CourseCode: "22FD603", RegisterNos: expandRange("7376232FD142", "7376232FD152")},

		// S.No 131 - WW 213 - B.Tech. IT - 22IT603
		{HallNo: "WW 213", CourseCode: "22IT603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232IT157", "7376232IT160")...)
			r = append(r, expandRange("7376232IT162", "7376232IT167")...)
			return r
		}()},

		// S.No 132 - WW 213 - B.Tech. AD - 22AI603
		{HallNo: "WW 213", CourseCode: "22AI603", RegisterNos: expandRange("7376242AD501", "7376242AD510")},

		// S.No 133 - WW 213 - B.Tech. AL - 22AM603
		{HallNo: "WW 213", CourseCode: "22AM603", RegisterNos: expandRange("7376232AL101", "7376232AL105")},

		// S.No 134 - WW 214 - B.Tech. IT - 22IT603
		{HallNo: "WW 214", CourseCode: "22IT603", RegisterNos: expandRange("7376232IT188", "7376232IT197")},

		// S.No 135 - WW 214 - B.Tech. AL - 22AM603
		{HallNo: "WW 214", CourseCode: "22AM603", RegisterNos: expandRange("7376232AL131", "7376232AL145")},

		// S.No 136 - WW 215 - B.Tech. IT - 22IT603
		{HallNo: "WW 215", CourseCode: "22IT603", RegisterNos: expandRange("7376232IT198", "7376232IT207")},

		// S.No 137 - WW 215 - B.Tech. AL - 22AM603
		{HallNo: "WW 215", CourseCode: "22AM603", RegisterNos: expandRange("7376232AL146", "7376232AL160")},

		// S.No 138 - WW 218 - B.E. CD - 22CD603
		{HallNo: "WW 218", CourseCode: "22CD603", RegisterNos: expandRange("7376241CD501", "7376241CD503")},

		// S.No 139 - WW 218 - B.Tech. CT - 22CT603
		{HallNo: "WW 218", CourseCode: "22CT603", RegisterNos: expandRange("7376232CT101", "7376232CT107")},

		// S.No 140 - WW 218 - B.Tech. AG - 22AG603
		{HallNo: "WW 218", CourseCode: "22AG603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AG116", "7376232AG129")...)
			r = append(r, "7376232AG131")
			return r
		}()},

		// S.No 141 - WW 219 - B.Tech. CT - 22CT603
		{HallNo: "WW 219", CourseCode: "22CT603", RegisterNos: expandRange("7376232CT108", "7376232CT117")},

		// S.No 142 - WW 219 - B.Tech. AG - 22AG603
		{HallNo: "WW 219", CourseCode: "22AG603", RegisterNos: expandRange("7376232AG132", "7376232AG146")},

		// S.No 143 - WW 222 - 22AG603
		{HallNo: "WW 222", CourseCode: "22AG603", RegisterNos: []string{"7376232AG502"}},

		// S.No 144 - WW 222 - B.E. BM - 22BM603
		{HallNo: "WW 222", CourseCode: "22BM603", RegisterNos: expandRange("7376231BM101", "7376231BM112")},

		// S.No 145 - WW 222 - B.Tech. CT - 22CT603
		{HallNo: "WW 222", CourseCode: "22CT603", RegisterNos: expandRange("7376232CT118", "7376232CT142")},

		// S.No 146 - WW 222 - B.Tech. AG - 22AG603
		{HallNo: "WW 222", CourseCode: "22AG603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232AG147", "7376232AG154")...)
			r = append(r, expandRange("7376242AG501", "7376242AG504")...)
			return r
		}()},

		// S.No 147 - WW 223 - B.E. EI - 22EI603
		{HallNo: "WW 223", CourseCode: "22EI603", RegisterNos: []string{"7376231EI101", "7376231EI102"}},

		// S.No 148 - WW 223 - B.E. BM - 22BM603
		{HallNo: "WW 223", CourseCode: "22BM603", RegisterNos: expandRange("7376231BM113", "7376231BM137")},

		// S.No 149 - WW 223 - B.Tech. CT - 22CT603
		{HallNo: "WW 223", CourseCode: "22CT603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232CT143", "7376232CT162")...)
			r = append(r, expandRange("7376242CT501", "7376242CT503")...)
			return r
		}()},

		// S.No 150 - WW 224 - B.E. EI - 22EI603
		{HallNo: "WW 224", CourseCode: "22EI603", RegisterNos: expandRange("7376231EI103", "7376231EI127")},

		// S.No 151 - WW 224 - B.E. BM - 22BM603
		{HallNo: "WW 224", CourseCode: "22BM603", RegisterNos: expandRange("7376231BM138", "7376231BM151")},

		// S.No 152 - WW 224 - B.Tech. FT - 22FT603
		{HallNo: "WW 224", CourseCode: "22FT603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232FT101", "7376232FT106")...)
			r = append(r, expandRange("7376232FT108", "7376232FT112")...)
			return r
		}()},

		// S.No 153 - WW 225 - B.E. SE - 22IS603
		{HallNo: "WW 225", CourseCode: "22IS603", RegisterNos: []string{
			"7376221SE123", "7376221SE131", "7376221SE134", "7376221SE140",
		}},

		// S.No 154 - WW 225 - B.E. EI - 22EI603
		{HallNo: "WW 225", CourseCode: "22EI603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231EI128", "7376231EI160")...)
			r = append(r, expandRange("7376241EI501", "7376241EI504")...)
			return r
		}()},

		// S.No 155 - WW 225 - B.Tech. FT - 22FT603
		{HallNo: "WW 225", CourseCode: "22FT603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232FT113", "7376232FT120")...)
			r = append(r, "7376242FT501")
			return r
		}()},

		// S.No 156 - WW 226 - B.E. SE - 22IS603
		{HallNo: "WW 226", CourseCode: "22IS603", RegisterNos: []string{"7376221SE157"}},

		// S.No 157 - WW 226 - 22IS603
		{HallNo: "WW 226", CourseCode: "22IS603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231SE101", "7376231SE143")...)
			r = append(r, expandRange("7376231SE145", "7376231SE150")...)
			return r
		}()},

		// S.No 158 - WW 227 - 22IS603
		{HallNo: "WW 227", CourseCode: "22IS603", RegisterNos: []string{"7376231SE504"}},

		// S.No 159 - WW 227 - B.Tech. FD - 22FD603
		{HallNo: "WW 227", CourseCode: "22FD603", RegisterNos: []string{
			"7376222FD107", "7376222FD116", "7376222FD121", "7376222FD125",
		}},

		// S.No 160 - WW 227 - B.E. SE - 22IS603
		{HallNo: "WW 227", CourseCode: "22IS603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376231SE151", "7376231SE155")...)
			r = append(r, "7376241SE501")
			return r
		}()},

		// S.No 161 - WW 227 - B.Tech. FD - 22FD603
		{HallNo: "WW 227", CourseCode: "22FD603", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376232FD101", "7376232FD103")...)
			r = append(r, expandRange("7376232FD105", "7376232FD120")...)
			r = append(r, expandRange("7376232FD122", "7376232FD141")...)
			return r
		}()},
	}
}

// buildSeatingData15AN returns all seating records from the 15-05-2026 AN exam
// Exam Date: 15-05-2026 | Session: AN - 01:30 PM to 04:30 PM
func buildSeatingData15AN() []models.SeatingRecord {
	return []models.SeatingRecord{

		// S.No 1 - EW 101 - B.E. CS - 22CS016
		{HallNo: "EW 101", CourseCode: "22CS016", RegisterNos: []string{
			"7376221CS109", "7376221CS118", "7376221CS275", "7376221CS303",
			"7376231CS514", "7376231CS519", "7376231CS520",
		}},

		// S.No 2 - EW 101 - B.E. EC - 22EC044
		{HallNo: "EW 101", CourseCode: "22EC044", RegisterNos: []string{"7376221EC107", "7376221EC192"}},

		// S.No 3 - EW 101 - B.E. ME - 22ME009
		{HallNo: "EW 101", CourseCode: "22ME009", RegisterNos: []string{"7376221ME111", "7376221ME154"}},

		// S.No 4 - EW 101 - B.E. CD - 22CD016
		{HallNo: "EW 101", CourseCode: "22CD016", RegisterNos: []string{"7376221CD114"}},

		// S.No 5 - EW 101 - B.Tech. IT - 22IT016
		{HallNo: "EW 101", CourseCode: "22IT016", RegisterNos: []string{"7376222IT104", "7376222IT123"}},

		// S.No 6 - EW 101 - B.Tech. CB - 22CB015
		{HallNo: "EW 101", CourseCode: "22CB015", RegisterNos: []string{"7376232CB505"}},

		// S.No 7 - EW 101 - B.Tech. AD - 22AI024
		{HallNo: "EW 101", CourseCode: "22AI024", RegisterNos: []string{"7376232AD505"}},

		// S.No 8 - EW 101 - B.Tech. AL - 22AM018
		{HallNo: "EW 101", CourseCode: "22AM018", RegisterNos: []string{"7376222AL132"}},

		// S.No 9 - EW 101 - B.Tech. AG - 22AG015
		{HallNo: "EW 101", CourseCode: "22AG015", RegisterNos: []string{"7376222AG120", "7376222AG158"}},

		// S.No 10 - EW 101 - B.E. BM - 22BM020
		{HallNo: "EW 101", CourseCode: "22BM020", RegisterNos: []string{
			"7376231BM107", "7376231BM134", "7376231BM148", "7376241BM501",
		}},

		// S.No 11 - EW 101 - B.Tech. BT - 22BT002
		{HallNo: "EW 101", CourseCode: "22BT002", RegisterNos: []string{"7376232BT134", "7376232BT142"}},

		// S.No 12 - EW 102 - B.E. CE - 22CE003
		{HallNo: "EW 102", CourseCode: "22CE003", RegisterNos: []string{"7376221CE124"}},

		// S.No 13 - EW 102 - B.E. EC - 22EC007
		{HallNo: "EW 102", CourseCode: "22EC007", RegisterNos: []string{"7376221EC116"}},

		// S.No 14 - EW 102 - B.E. EE - 22EE037
		{HallNo: "EW 102", CourseCode: "22EE037", RegisterNos: []string{"7376221EE147"}},

		// S.No 15 - EW 102 - B.E. MC - 22MC009
		{HallNo: "EW 102", CourseCode: "22MC009", RegisterNos: []string{"7376231MC506"}},

		// S.No 16 - EW 102 - B.E. SE - 22IS010
		{HallNo: "EW 102", CourseCode: "22IS010", RegisterNos: []string{"7376221SE134"}},

		// S.No 17 - EW 102 - B.Tech. FD - 22FD014
		{HallNo: "EW 102", CourseCode: "22FD014", RegisterNos: []string{"7376222FD107"}},

		// S.No 18 - EW 102 - B.Tech. CT - 22CT016
		{HallNo: "EW 102", CourseCode: "22CT016", RegisterNos: []string{"7376232CT501"}},
	}
}

// buildSeatingData16FN returns all seating records from the 16-05-2026 FN exam
// Exam Date: 16-05-2026 | Session: FN - 09:00 AM to 12:00 PM
func buildSeatingData16FN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - AE 302 - B.E. CS - 22CS404
		{HallNo: "AE 302", CourseCode: "22CS404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS148", "7376241CS157")...)
			r = append(r, expandRange("7376241CS159", "7376241CS163")...)
			return r
		}()},

		// S.No 2 - AE 302 - B.E. EC - 22EC404
		{HallNo: "AE 302", CourseCode: "22EC404", RegisterNos: expandRange("7376241EC127", "7376241EC136")},

		// S.No 3 - EW 101 - B.E. CS - 22CS404
		{HallNo: "EW 101", CourseCode: "22CS404", RegisterNos: expandRange("7376241CS164", "7376241CS178")},

		// S.No 4 - EW 101 - B.E. EC - 22EC404
		{HallNo: "EW 101", CourseCode: "22EC404", RegisterNos: expandRange("7376241EC137", "7376241EC146")},

		// S.No 5 - EW 102 - B.E. CS - 22CS404
		{HallNo: "EW 102", CourseCode: "22CS404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS179", "7376241CS188")...)
			r = append(r, expandRange("7376241CS190", "7376241CS194")...)
			return r
		}()},

		// S.No 6 - EW 102 - B.E. EC - 22EC404
		{HallNo: "EW 102", CourseCode: "22EC404", RegisterNos: expandRange("7376241EC147", "7376241EC156")},

		// S.No 7 - EW 103 - B.E. CS - 22CS404
		{HallNo: "EW 103", CourseCode: "22CS404", RegisterNos: expandRange("7376241CS241", "7376241CS255")},

		// S.No 8 - EW 103 - B.E. EC - 22EC404
		{HallNo: "EW 103", CourseCode: "22EC404", RegisterNos: expandRange("7376241EC188", "7376241EC197")},

		// S.No 9 - EW 104 - B.E. CS - 22CS404
		{HallNo: "EW 104", CourseCode: "22CS404", RegisterNos: expandRange("7376241CS331", "7376241CS345")},

		// S.No 10 - EW 104 - B.E. EC - 22EC404
		{HallNo: "EW 104", CourseCode: "22EC404", RegisterNos: expandRange("7376241EC250", "7376241EC259")},

		// S.No 11 - EW 105 - B.E. CS - 22CS404
		{HallNo: "EW 105", CourseCode: "22CS404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS346", "7376241CS353")...)
			r = append(r, expandRange("7376241CS355", "7376241CS361")...)
			return r
		}()},

		// S.No 12 - EW 105 - B.E. EC - 22EC404
		{HallNo: "EW 105", CourseCode: "22EC404", RegisterNos: expandRange("7376241EC260", "7376241EC269")},

		// S.No 13 - EW 106 - B.E. CS - 22CS404
		{HallNo: "EW 106", CourseCode: "22CS404", RegisterNos: expandRange("7376241CS448", "7376241CS462")},

		// S.No 14 - EW 106 - B.E. EC - 22EC404
		{HallNo: "EW 106", CourseCode: "22EC404", RegisterNos: expandRange("7376241EC335", "7376241EC344")},

		// S.No 15 - EW 107 - B.E. CS - 22CS404
		{HallNo: "EW 107", CourseCode: "22CS404", RegisterNos: expandRange("7376241CS210", "7376241CS224")},

		// S.No 16 - EW 107 - B.E. EC - 22EC404
		{HallNo: "EW 107", CourseCode: "22EC404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EC167", "7376241EC174")...)
			r = append(r, "7376241EC176", "7376241EC177")
			return r
		}()},

		// S.No 17 - EW 108 - B.E. CS - 22CS404
		{HallNo: "EW 108", CourseCode: "22CS404", RegisterNos: expandRange("7376241CS256", "7376241CS270")},

		// S.No 18 - EW 108 - B.E. EC - 22EC404
		{HallNo: "EW 108", CourseCode: "22EC404", RegisterNos: expandRange("7376241EC198", "7376241EC207")},

		// S.No 19 - EW 109 - B.E. CS - 22CS404
		{HallNo: "EW 109", CourseCode: "22CS404", RegisterNos: expandRange("7376241CS286", "7376241CS300")},

		// S.No 20 - EW 109 - B.E. EC - 22EC404
		{HallNo: "EW 109", CourseCode: "22EC404", RegisterNos: expandRange("7376241EC219", "7376241EC228")},

		// S.No 21 - EW 111 - B.E. CS - 22CS404
		{HallNo: "EW 111", CourseCode: "22CS404", RegisterNos: expandRange("7376241CS316", "7376241CS330")},

		// S.No 22 - EW 111 - B.E. EC - 22EC404
		{HallNo: "EW 111", CourseCode: "22EC404", RegisterNos: expandRange("7376241EC240", "7376241EC249")},

		// S.No 23 - EW 112 - B.E. CS - 22CS404
		{HallNo: "EW 112", CourseCode: "22CS404", RegisterNos: expandRange("7376241CS362", "7376241CS376")},

		// S.No 24 - EW 112 - B.E. EC - 22EC404
		{HallNo: "EW 112", CourseCode: "22EC404", RegisterNos: expandRange("7376241EC270", "7376241EC279")},

		// S.No 25 - EW 113 - B.Tech. IT - 22IT404
		{HallNo: "EW 113", CourseCode: "22IT404", RegisterNos: expandRange("7376242IT254", "7376242IT268")},

		// S.No 26 - EW 113 - B.Tech. AD - 22AI404
		{HallNo: "EW 113", CourseCode: "22AI404", RegisterNos: expandRange("7376242AD220", "7376242AD229")},

		// S.No 27 - EW 114 - B.Tech. IT - 22IT404
		{HallNo: "EW 114", CourseCode: "22IT404", RegisterNos: []string{"7376242IT506", "7376242IT509"}},

		// S.No 28 - EW 114 - 22IT404
		{HallNo: "EW 114", CourseCode: "22IT404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT340", "7376242IT351")...)
			r = append(r, "7376252IT501")
			return r
		}()},

		// S.No 29 - EW 114 - B.Tech. AD - 22AI404
		{HallNo: "EW 114", CourseCode: "22AI404", RegisterNos: expandRange("7376242AD280", "7376242AD289")},

		// S.No 30 - EW 115 - B.E. EE - 22EE404
		{HallNo: "EW 115", CourseCode: "22EE404", RegisterNos: expandRange("7376241EE118", "7376241EE132")},

		// S.No 31 - EW 115 - B.Tech. AD - 22AI404
		{HallNo: "EW 115", CourseCode: "22AI404", RegisterNos: expandRange("7376242AD325", "7376242AD334")},

		// S.No 32 - EW 116 - B.E. EE - 22EE404
		{HallNo: "EW 116", CourseCode: "22EE404", RegisterNos: expandRange("7376241EE133", "7376241EE147")},

		// S.No 33 - EW 116 - B.Tech. AD - 22AI404
		{HallNo: "EW 116", CourseCode: "22AI404", RegisterNos: expandRange("7376242AD335", "7376242AD344")},

		// S.No 34 - EW 117 - B.Tech. AL - 22AM404
		{HallNo: "EW 117", CourseCode: "22AM404", RegisterNos: []string{"7376232AL510"}},

		// S.No 35 - EW 117 - 22AM404
		{HallNo: "EW 117", CourseCode: "22AM404", RegisterNos: []string{"7376232AL183"}},

		// S.No 36 - EW 117 - B.E. EE - 22EE404
		{HallNo: "EW 117", CourseCode: "22EE404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EE163", "7376241EE171")...)
			r = append(r, expandRange("7376241EE173", "7376241EE178")...)
			return r
		}()},

		// S.No 37 - EW 117 - B.Tech. AD - 22AI404
		{HallNo: "EW 117", CourseCode: "22AI404", RegisterNos: expandRange("7376252AD509", "7376252AD516")},

		// S.No 38 - EW 118 - B.E. EE - 22EE404
		{HallNo: "EW 118", CourseCode: "22EE404", RegisterNos: expandRange("7376241EE194", "7376241EE208")},

		// S.No 39 - EW 118 - B.Tech. AL - 22AM404
		{HallNo: "EW 118", CourseCode: "22AM404", RegisterNos: expandRange("7376242AL111", "7376242AL120")},

		// S.No 40 - EW 201 - B.E. EC - 22EC404
		{HallNo: "EW 201", CourseCode: "22EC404", RegisterNos: []string{"7376241EC517", "7376241EC521"}},

		// S.No 41 - EW 201 - B.E. CS - 22CS404
		{HallNo: "EW 201", CourseCode: "22CS404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS502", "7376251CS513")...)
			r = append(r, expandRange("7376251CS515", "7376251CS517")...)
			return r
		}()},

		// S.No 42 - EW 201 - B.E. EC - 22EC404
		{HallNo: "EW 201", CourseCode: "22EC404", RegisterNos: expandRange("7376251EC501", "7376251EC508")},

		// S.No 43 - EW 202 - B.Tech. IT - 22IT404
		{HallNo: "EW 202", CourseCode: "22IT404", RegisterNos: []string{"7376222IT110"}},

		// S.No 44 - EW 202 - 22IT404
		{HallNo: "EW 202", CourseCode: "22IT404", RegisterNos: []string{
			"7376232IT113", "7376232IT118", "7376232IT146", "7376232IT152", "7376232IT282",
		}},

		// S.No 45 - EW 202 - B.E. CS - 22CS404
		{HallNo: "EW 202", CourseCode: "22CS404", RegisterNos: expandRange("7376251CS518", "7376251CS524")},

		// S.No 46 - EW 202 - B.E. EC - 22EC404
		{HallNo: "EW 202", CourseCode: "22EC404", RegisterNos: expandRange("7376251EC509", "7376251EC518")},

		// S.No 47 - EW 202 - B.Tech. IT - 22IT404
		{HallNo: "EW 202", CourseCode: "22IT404", RegisterNos: []string{"7376242IT101", "7376242IT102"}},

		// S.No 48 - EW 203 - 22IT404
		{HallNo: "EW 203", CourseCode: "22IT404", RegisterNos: expandRange("7376242IT269", "7376242IT283")},

		// S.No 49 - EW 203 - B.Tech. AD - 22AI404
		{HallNo: "EW 203", CourseCode: "22AI404", RegisterNos: expandRange("7376242AD230", "7376242AD239")},

		// S.No 50 - EW 204 - B.Tech. IT - 22IT404
		{HallNo: "EW 204", CourseCode: "22IT404", RegisterNos: expandRange("7376242IT315", "7376242IT324")},

		// S.No 51 - EW 204 - B.Tech. AD - 22AI404
		{HallNo: "EW 204", CourseCode: "22AI404", RegisterNos: expandRange("7376242AD260", "7376242AD269")},

		// S.No 52 - EW 205 - B.Tech. IT - 22IT404
		{HallNo: "EW 205", CourseCode: "22IT404", RegisterNos: expandRange("7376252IT502", "7376252IT511")},

		// S.No 53 - EW 205 - B.Tech. AD - 22AI404
		{HallNo: "EW 205", CourseCode: "22AI404", RegisterNos: expandRange("7376242AD290", "7376242AD299")},

		// S.No 54 - EW 206 - B.E. EE - 22EE404
		{HallNo: "EW 206", CourseCode: "22EE404", RegisterNos: []string{
			"7376231EE104", "7376231EE111", "7376231EE115", "7376231EE149",
		}},

		// S.No 55 - EW 206 - 22EE404
		{HallNo: "EW 206", CourseCode: "22EE404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EE101", "7376241EE111")...)
			r = append(r, expandRange("7376241EE113", "7376241EE117")...)
			return r
		}()},

		// S.No 56 - EW 206 - B.Tech. IT - 22IT404
		{HallNo: "EW 206", CourseCode: "22IT404", RegisterNos: expandRange("7376252IT512", "7376252IT516")},

		// S.No 57 - EW 206 - B.Tech. AD - 22AI404
		{HallNo: "EW 206", CourseCode: "22AI404", RegisterNos: expandRange("7376242AD300", "7376242AD324")},

		// S.No 58 - EW 210 - B.Tech. IT - 22IT404
		{HallNo: "EW 210", CourseCode: "22IT404", RegisterNos: expandRange("7376242IT118", "7376242IT127")},

		// S.No 59 - EW 210 - B.Tech. AD - 22AI404
		{HallNo: "EW 210", CourseCode: "22AI404", RegisterNos: expandRange("7376242AD104", "7376242AD113")},

		// S.No 60 - EW 211 - B.Tech. IT - 22IT404
		{HallNo: "EW 211", CourseCode: "22IT404", RegisterNos: expandRange("7376242IT194", "7376242IT203")},

		// S.No 61 - EW 211 - B.Tech. AD - 22AI404
		{HallNo: "EW 211", CourseCode: "22AI404", RegisterNos: expandRange("7376242AD165", "7376242AD174")},

		// S.No 62 - EW 212 - B.Tech. IT - 22IT404
		{HallNo: "EW 212", CourseCode: "22IT404", RegisterNos: expandRange("7376242IT204", "7376242IT228")},

		// S.No 63 - EW 212 - B.Tech. AD - 22AI404
		{HallNo: "EW 212", CourseCode: "22AI404", RegisterNos: expandRange("7376242AD175", "7376242AD199")},

		// S.No 64 - EW 213 - B.E. EE - 22EE404
		{HallNo: "EW 213", CourseCode: "22EE404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EE209", "7376241EE217")...)
			r = append(r, expandRange("7376251EE501", "7376251EE506")...)
			return r
		}()},

		// S.No 65 - EW 213 - B.Tech. AL - 22AM404
		{HallNo: "EW 213", CourseCode: "22AM404", RegisterNos: expandRange("7376242AL121", "7376242AL130")},

		// S.No 66 - EW 214 - B.Tech. BT - 22BT404
		{HallNo: "EW 214", CourseCode: "22BT404", RegisterNos: []string{"7376222BT110"}},

		// S.No 67 - EW 214 - 22BT404
		{HallNo: "EW 214", CourseCode: "22BT404", RegisterNos: []string{
			"7376232BT115", "7376232BT134", "7376232BT142",
		}},

		// S.No 68 - EW 214 - B.E. EE - 22EE404
		{HallNo: "EW 214", CourseCode: "22EE404", RegisterNos: expandRange("7376251EE507", "7376251EE517")},

		// S.No 69 - EW 214 - B.Tech. AL - 22AM404
		{HallNo: "EW 214", CourseCode: "22AM404", RegisterNos: expandRange("7376242AL131", "7376242AL140")},

		// S.No 70 - EW 215 - B.Tech. BT - 22BT404
		{HallNo: "EW 215", CourseCode: "22BT404", RegisterNos: expandRange("7376242BT108", "7376242BT122")},

		// S.No 71 - EW 215 - B.Tech. AL - 22AM404
		{HallNo: "EW 215", CourseCode: "22AM404", RegisterNos: expandRange("7376242AL151", "7376242AL160")},

		// S.No 72 - EW 216 - B.Tech. BT - 22BT404
		{HallNo: "EW 216", CourseCode: "22BT404", RegisterNos: expandRange("7376242BT133", "7376242BT142")},

		// S.No 73 - EW 216 - B.Tech. AL - 22AM404
		{HallNo: "EW 216", CourseCode: "22AM404", RegisterNos: expandRange("7376242AL171", "7376242AL180")},

		// S.No 74 - EW 217 - B.Tech. BT - 22BT404
		{HallNo: "EW 217", CourseCode: "22BT404", RegisterNos: expandRange("7376242BT143", "7376242BT152")},

		// S.No 75 - EW 217 - B.Tech. AL - 22AM404
		{HallNo: "EW 217", CourseCode: "22AM404", RegisterNos: expandRange("7376242AL181", "7376242AL190")},

		// S.No 76 - EW 218 - B.Tech. BT - 22BT404
		{HallNo: "EW 218", CourseCode: "22BT404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242BT153", "7376242BT160")...)
			r = append(r, expandRange("7376242BT162", "7376242BT178")...)
			return r
		}()},

		// S.No 77 - EW 218 - B.Tech. AL - 22AM404
		{HallNo: "EW 218", CourseCode: "22AM404", RegisterNos: expandRange("7376242AL191", "7376242AL215")},

		// S.No 78 - MH 301 - B.E. CS - 22CS404
		{HallNo: "MH 301", CourseCode: "22CS404", RegisterNos: []string{
			"7376221CS111", "7376221CS118", "7376221CS140", "7376221CS196",
			"7376221CS275", "7376221CS288", "7376221CS322",
		}},

		// S.No 79 - MH 301 - B.E. EC - 22EC404
		{HallNo: "MH 301", CourseCode: "22EC404", RegisterNos: []string{
			"7376221EC102", "7376221EC116", "7376221EC151", "7376221EC192",
			"7376221EC226", "7376221EC286", "7376221EC290",
		}},

		// S.No 80 - MH 301 - B.E. CS - 22CS404
		{HallNo: "MH 301", CourseCode: "22CS404", RegisterNos: []string{
			"7376231CS102", "7376231CS103", "7376231CS190", "7376231CS235",
			"7376231CS244", "7376231CS259", "7376231CS292",
		}},

		// S.No 81 - MH 301 - B.E. EC - 22EC404
		{HallNo: "MH 301", CourseCode: "22EC404", RegisterNos: []string{
			"7376231EC110", "7376231EC112", "7376231EC196",
		}},

		// S.No 82 - MH 301 - B.E. CS - 22CS404
		{HallNo: "MH 301", CourseCode: "22CS404", RegisterNos: []string{"7376241CS102"}},

		// S.No 83 - MH 302 - B.E. EC - 22EC404
		{HallNo: "MH 302", CourseCode: "22EC404", RegisterNos: []string{"7376231EC502", "7376231EC514"}},

		// S.No 84 - MH 302 - 22EC404
		{HallNo: "MH 302", CourseCode: "22EC404", RegisterNos: []string{
			"7376231EC283", "7376231EC297", "7376231EC305",
			"7376231EC318", "7376231EC331", "7376231EC334",
		}},

		// S.No 85 - MH 302 - B.E. CS - 22CS404
		{HallNo: "MH 302", CourseCode: "22CS404", RegisterNos: expandRange("7376241CS103", "7376241CS117")},

		// S.No 86 - MH 302 - B.E. EC - 22EC404
		{HallNo: "MH 302", CourseCode: "22EC404", RegisterNos: []string{"7376241EC103", "7376241EC104"}},

		// S.No 87 - MH 303 - B.E. CS - 22CS404
		{HallNo: "MH 303", CourseCode: "22CS404", RegisterNos: expandRange("7376241CS118", "7376241CS132")},

		// S.No 88 - MH 303 - B.E. EC - 22EC404
		{HallNo: "MH 303", CourseCode: "22EC404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EC105", "7376241EC110")...)
			r = append(r, "7376241EC112", "7376241EC113", "7376241EC115", "7376241EC116")
			return r
		}()},

		// S.No 89 - MH 305 - B.E. CS - 22CS404
		{HallNo: "MH 305", CourseCode: "22CS404", RegisterNos: expandRange("7376241CS133", "7376241CS147")},

		// S.No 90 - MH 305 - B.E. EC - 22EC404
		{HallNo: "MH 305", CourseCode: "22EC404", RegisterNos: expandRange("7376241EC117", "7376241EC126")},

		// S.No 91 - WW 002 - B.Tech. IT - 22IT404
		{HallNo: "WW 002", CourseCode: "22IT404", RegisterNos: expandRange("7376242IT174", "7376242IT183")},

		// S.No 92 - WW 002 - B.Tech. AD - 22AI404
		{HallNo: "WW 002", CourseCode: "22AI404", RegisterNos: expandRange("7376242AD145", "7376242AD154")},

		// S.No 93 - WW 003 - B.Tech. IT - 22IT404
		{HallNo: "WW 003", CourseCode: "22IT404", RegisterNos: expandRange("7376242IT184", "7376242IT193")},

		// S.No 94 - WW 003 - B.Tech. AD - 22AI404
		{HallNo: "WW 003", CourseCode: "22AI404", RegisterNos: expandRange("7376242AD155", "7376242AD164")},

		// S.No 95 - WW 004 - B.Tech. IT - 22IT404
		{HallNo: "WW 004", CourseCode: "22IT404", RegisterNos: expandRange("7376242IT229", "7376242IT238")},

		// S.No 96 - WW 004 - B.Tech. AD - 22AI404
		{HallNo: "WW 004", CourseCode: "22AI404", RegisterNos: expandRange("7376242AD200", "7376242AD209")},

		// S.No 97 - WW 005 - B.Tech. IT - 22IT404
		{HallNo: "WW 005", CourseCode: "22IT404", RegisterNos: expandRange("7376242IT239", "7376242IT253")},

		// S.No 98 - WW 005 - B.Tech. AD - 22AI404
		{HallNo: "WW 005", CourseCode: "22AI404", RegisterNos: expandRange("7376242AD210", "7376242AD219")},

		// S.No 99 - WW 006 - B.Tech. IT - 22IT404
		{HallNo: "WW 006", CourseCode: "22IT404", RegisterNos: expandRange("7376242IT284", "7376242IT298")},

		// S.No 100 - WW 006 - B.Tech. AD - 22AI404
		{HallNo: "WW 006", CourseCode: "22AI404", RegisterNos: expandRange("7376242AD240", "7376242AD249")},

		// S.No 101 - WW 007 - B.Tech. IT - 22IT404
		{HallNo: "WW 007", CourseCode: "22IT404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT299", "7376242IT303")...)
			r = append(r, expandRange("7376242IT305", "7376242IT314")...)
			return r
		}()},

		// S.No 102 - WW 007 - B.Tech. AD - 22AI404
		{HallNo: "WW 007", CourseCode: "22AI404", RegisterNos: expandRange("7376242AD250", "7376242AD259")},

		// S.No 103 - WW 008 - B.Tech. IT - 22IT404
		{HallNo: "WW 008", CourseCode: "22IT404", RegisterNos: expandRange("7376242IT325", "7376242IT339")},

		// S.No 104 - WW 008 - B.Tech. AD - 22AI404
		{HallNo: "WW 008", CourseCode: "22AI404", RegisterNos: expandRange("7376242AD270", "7376242AD279")},

		// S.No 105 - WW 011 - B.E. EE - 22EE404
		{HallNo: "WW 011", CourseCode: "22EE404", RegisterNos: expandRange("7376241EE148", "7376241EE162")},

		// S.No 106 - WW 011 - B.Tech. AD - 22AI404
		{HallNo: "WW 011", CourseCode: "22AI404", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376242AD345", "7376242AD346")
			r = append(r, expandRange("7376252AD501", "7376252AD508")...)
			return r
		}()},

		// S.No 107 - WW 012 - B.E. EE - 22EE404
		{HallNo: "WW 012", CourseCode: "22EE404", RegisterNos: expandRange("7376241EE179", "7376241EE193")},

		// S.No 108 - WW 012 - B.Tech. AL - 22AM404
		{HallNo: "WW 012", CourseCode: "22AM404", RegisterNos: expandRange("7376242AL101", "7376242AL110")},

		// S.No 109 - WW 113 - B.E. CS - 22CS404
		{HallNo: "WW 113", CourseCode: "22CS404", RegisterNos: expandRange("7376241CS195", "7376241CS209")},

		// S.No 110 - WW 113 - B.E. EC - 22EC404
		{HallNo: "WW 113", CourseCode: "22EC404", RegisterNos: expandRange("7376241EC157", "7376241EC166")},

		// S.No 111 - WW 114 - B.E. CS - 22CS404
		{HallNo: "WW 114", CourseCode: "22CS404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS225", "7376241CS228")...)
			r = append(r, expandRange("7376241CS230", "7376241CS240")...)
			return r
		}()},

		// S.No 112 - WW 114 - B.E. EC - 22EC404
		{HallNo: "WW 114", CourseCode: "22EC404", RegisterNos: expandRange("7376241EC178", "7376241EC187")},

		// S.No 113 - WW 115 - B.E. CS - 22CS404
		{HallNo: "WW 115", CourseCode: "22CS404", RegisterNos: expandRange("7376241CS271", "7376241CS285")},

		// S.No 114 - WW 115 - B.E. EC - 22EC404
		{HallNo: "WW 115", CourseCode: "22EC404", RegisterNos: expandRange("7376241EC209", "7376241EC218")},

		// S.No 115 - WW 117 - B.E. CS - 22CS404
		{HallNo: "WW 117", CourseCode: "22CS404", RegisterNos: expandRange("7376241CS301", "7376241CS315")},

		// S.No 116 - WW 117 - B.E. EC - 22EC404
		{HallNo: "WW 117", CourseCode: "22EC404", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241EC229", "7376241EC230")
			r = append(r, expandRange("7376241EC232", "7376241EC239")...)
			return r
		}()},

		// S.No 117 - WW 118 - B.E. CS - 22CS404
		{HallNo: "WW 118", CourseCode: "22CS404", RegisterNos: expandRange("7376241CS377", "7376241CS391")},

		// S.No 118 - WW 118 - B.E. EC - 22EC404
		{HallNo: "WW 118", CourseCode: "22EC404", RegisterNos: expandRange("7376241EC280", "7376241EC289")},

		// S.No 119 - WW 202 - B.E. CS - 22CS404
		{HallNo: "WW 202", CourseCode: "22CS404", RegisterNos: expandRange("7376241CS392", "7376241CS416")},

		// S.No 120 - WW 202 - B.E. EC - 22EC404
		{HallNo: "WW 202", CourseCode: "22EC404", RegisterNos: expandRange("7376241EC290", "7376241EC314")},

		// S.No 121 - WW 203 - B.E. CS - 22CS404
		{HallNo: "WW 203", CourseCode: "22CS404", RegisterNos: expandRange("7376241CS417", "7376241CS431")},

		// S.No 122 - WW 203 - B.E. EC - 22EC404
		{HallNo: "WW 203", CourseCode: "22EC404", RegisterNos: expandRange("7376241EC315", "7376241EC324")},

		// S.No 123 - WW 204 - 22EC404
		{HallNo: "WW 204", CourseCode: "22EC404", RegisterNos: []string{"7376241EC511", "7376241EC516"}},

		// S.No 124 - WW 204 - B.E. CS - 22CS404
		{HallNo: "WW 204", CourseCode: "22CS404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS463", "7376241CS476")...)
			r = append(r, "7376251CS501")
			return r
		}()},

		// S.No 125 - WW 204 - B.E. EC - 22EC404
		{HallNo: "WW 204", CourseCode: "22EC404", RegisterNos: expandRange("7376241EC345", "7376241EC352")},

		// S.No 126 - WW 205 - B.Tech. IT - 22IT404
		{HallNo: "WW 205", CourseCode: "22IT404", RegisterNos: expandRange("7376242IT128", "7376242IT142")},

		// S.No 127 - WW 205 - B.Tech. AD - 22AI404
		{HallNo: "WW 205", CourseCode: "22AI404", RegisterNos: expandRange("7376242AD114", "7376242AD123")},

		// S.No 128 - WW 211 - B.E. CS - 22CS404
		{HallNo: "WW 211", CourseCode: "22CS404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241CS432", "7376241CS442")...)
			r = append(r, expandRange("7376241CS444", "7376241CS447")...)
			return r
		}()},

		// S.No 129 - WW 211 - B.E. EC - 22EC404
		{HallNo: "WW 211", CourseCode: "22EC404", RegisterNos: expandRange("7376241EC325", "7376241EC334")},

		// S.No 130 - WW 212 - B.E. CE - 22CE404
		{HallNo: "WW 212", CourseCode: "22CE404", RegisterNos: []string{"7376221CE124", "7376231CE503"}},

		// S.No 131 - WW 212 - B.E. ME - 22ME404
		{HallNo: "WW 212", CourseCode: "22ME404", RegisterNos: []string{"7376221ME138", "7376221ME154"}},

		// S.No 132 - WW 212 - B.E. BM - 22BM404
		{HallNo: "WW 212", CourseCode: "22BM404", RegisterNos: []string{"7376231BM502"}},

		// S.No 133 - WW 212 - B.E. SE - 22IS404
		{HallNo: "WW 212", CourseCode: "22IS404", RegisterNos: []string{
			"7376221SE134", "7376221SE140", "7376231SE504",
		}},

		// S.No 134 - WW 212 - B.E. CD - 22CD404
		{HallNo: "WW 212", CourseCode: "22CD404", RegisterNos: []string{
			"7376221CD114", "7376221CD144", "7376221CD153", "7376231CD503",
		}},

		// S.No 135 - WW 212 - B.Tech. FD - 22FD404
		{HallNo: "WW 212", CourseCode: "22FD404", RegisterNos: []string{"7376222FD107"}},

		// S.No 136 - WW 212 - B.E. CE - 22CE404
		{HallNo: "WW 212", CourseCode: "22CE404", RegisterNos: []string{"7376231CE120", "7376241CE501"}},

		// S.No 137 - WW 212 - B.E. BM - 22BM404
		{HallNo: "WW 212", CourseCode: "22BM404", RegisterNos: []string{
			"7376231BM107", "7376231BM132", "7376231BM134",
			"7376231BM137", "7376231BM148", "7376241BM501",
		}},

		// S.No 138 - WW 212 - B.E. CD - 22CD404
		{HallNo: "WW 212", CourseCode: "22CD404", RegisterNos: []string{"7376241CD501"}},

		// S.No 139 - WW 212 - B.Tech. FD - 22FD404
		{HallNo: "WW 212", CourseCode: "22FD404", RegisterNos: []string{"7376232FD137"}},

		// S.No 140 - WW 212 - B.Tech. CT - 22CT404
		{HallNo: "WW 212", CourseCode: "22CT404", RegisterNos: []string{"7376232CT122"}},

		// S.No 141 - WW 212 - B.Tech. AG - 22AG404
		{HallNo: "WW 212", CourseCode: "22AG404", RegisterNos: []string{"7376242AG501"}},

		// S.No 142 - WW 212 - 22AG404
		{HallNo: "WW 212", CourseCode: "22AG404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AG115", "7376242AG124")...)
			r = append(r, "7376252AG501", "7376252AG502")
			return r
		}()},

		// S.No 143 - WW 213 - B.Tech. AD - 22AI404
		{HallNo: "WW 213", CourseCode: "22AI404", RegisterNos: []string{"7376232AD502"}},

		// S.No 144 - WW 213 - 22AI404
		{HallNo: "WW 213", CourseCode: "22AI404", RegisterNos: []string{
			"7376232AD115", "7376232AD250", "7376232AD265", "7376232AD282",
		}},

		// S.No 145 - WW 213 - B.E. EC - 22EC404
		{HallNo: "WW 213", CourseCode: "22EC404", RegisterNos: expandRange("7376251EC519", "7376251EC521")},

		// S.No 146 - WW 213 - B.Tech. IT - 22IT404
		{HallNo: "WW 213", CourseCode: "22IT404", RegisterNos: expandRange("7376242IT103", "7376242IT117")},

		// S.No 147 - WW 213 - B.Tech. AD - 22AI404
		{HallNo: "WW 213", CourseCode: "22AI404", RegisterNos: []string{"7376242AD102", "7376242AD103"}},

		// S.No 148 - WW 214 - B.Tech. IT - 22IT404
		{HallNo: "WW 214", CourseCode: "22IT404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242IT143", "7376242IT153")...)
			r = append(r, expandRange("7376242IT155", "7376242IT158")...)
			return r
		}()},

		// S.No 149 - WW 214 - B.Tech. AD - 22AI404
		{HallNo: "WW 214", CourseCode: "22AI404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AD124", "7376242AD129")...)
			r = append(r, expandRange("7376242AD131", "7376242AD134")...)
			return r
		}()},

		// S.No 150 - WW 215 - B.Tech. IT - 22IT404
		{HallNo: "WW 215", CourseCode: "22IT404", RegisterNos: expandRange("7376242IT159", "7376242IT173")},

		// S.No 151 - WW 215 - B.Tech. AD - 22AI404
		{HallNo: "WW 215", CourseCode: "22AI404", RegisterNos: expandRange("7376242AD135", "7376242AD144")},

		// S.No 152 - WW 216 - B.Tech. BT - 22BT404
		{HallNo: "WW 216", CourseCode: "22BT404", RegisterNos: []string{
			"7376232BT152", "7376232BT163", "7376232BT176", "7376232BT200",
		}},

		// S.No 153 - WW 216 - 22BT404
		{HallNo: "WW 216", CourseCode: "22BT404", RegisterNos: expandRange("7376242BT102", "7376242BT107")},

		// S.No 154 - WW 216 - B.Tech. AL - 22AM404
		{HallNo: "WW 216", CourseCode: "22AM404", RegisterNos: expandRange("7376242AL141", "7376242AL150")},

		// S.No 155 - WW 217 - B.Tech. BT - 22BT404
		{HallNo: "WW 217", CourseCode: "22BT404", RegisterNos: expandRange("7376242BT123", "7376242BT132")},

		// S.No 156 - WW 217 - B.Tech. AL - 22AM404
		{HallNo: "WW 217", CourseCode: "22AM404", RegisterNos: expandRange("7376242AL161", "7376242AL170")},

		// S.No 157 - WW 218 - B.Tech. BT - 22BT404
		{HallNo: "WW 218", CourseCode: "22BT404", RegisterNos: expandRange("7376242BT179", "7376242BT193")},

		// S.No 158 - WW 218 - B.Tech. AL - 22AM404
		{HallNo: "WW 218", CourseCode: "22AM404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242AL216", "7376242AL223")...)
			r = append(r, "7376252AL501", "7376252AL502")
			return r
		}()},

		// S.No 159 - WW 219 - B.E. MZ - 22MC404
		{HallNo: "WW 219", CourseCode: "22MC404", RegisterNos: []string{
			"7376231MZ106", "7376231MZ107", "7376231MZ111",
			"7376231MZ113", "7376231MZ143", "7376231MZ148",
		}},

		// S.No 160 - WW 219 - 22MC404
		{HallNo: "WW 219", CourseCode: "22MC404", RegisterNos: expandRange("7376241MZ101", "7376241MZ103")},

		// S.No 161 - WW 219 - B.Tech. BT - 22BT404
		{HallNo: "WW 219", CourseCode: "22BT404", RegisterNos: expandRange("7376242BT194", "7376242BT208")},

		// S.No 162 - WW 219 - B.Tech. AL - 22AM404
		{HallNo: "WW 219", CourseCode: "22AM404", RegisterNos: []string{"7376252AL503"}},

		// S.No 163 - WW 222 - B.E. ME - 22ME404
		{HallNo: "WW 222", CourseCode: "22ME404", RegisterNos: []string{
			"7376231ME101", "7376231ME104", "7376231ME143", "7376231ME144", "7376231ME149",
		}},

		// S.No 164 - WW 222 - 22ME404
		{HallNo: "WW 222", CourseCode: "22ME404", RegisterNos: expandRange("7376241ME102", "7376241ME107")},

		// S.No 165 - WW 222 - B.E. MZ - 22MC404
		{HallNo: "WW 222", CourseCode: "22MC404", RegisterNos: expandRange("7376241MZ104", "7376241MZ128")},

		// S.No 166 - WW 222 - B.Tech. BT - 22BT404
		{HallNo: "WW 222", CourseCode: "22BT404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242BT209", "7376242BT218")...)
			r = append(r, expandRange("7376242BT220", "7376242BT222")...)
			r = append(r, "7376252BT501")
			return r
		}()},

		// S.No 167 - WW 223 - B.E. ME - 22ME404
		{HallNo: "WW 223", CourseCode: "22ME404", RegisterNos: expandRange("7376241ME108", "7376241ME132")},

		// S.No 168 - WW 223 - B.E. MZ - 22MC404
		{HallNo: "WW 223", CourseCode: "22MC404", RegisterNos: expandRange("7376241MZ129", "7376241MZ153")},

		// S.No 169 - WW 224 - B.E. MZ - 22MC404
		{HallNo: "WW 224", CourseCode: "22MC404", RegisterNos: []string{"7376241MZ501"}},

		// S.No 170 - WW 224 - B.Tech. CB - 22CB404
		{HallNo: "WW 224", CourseCode: "22CB404", RegisterNos: []string{
			"7376232CB106", "7376232CB111", "7376232CB123", "7376232CB133",
		}},

		// S.No 171 - WW 224 - B.E. ME - 22ME404
		{HallNo: "WW 224", CourseCode: "22ME404", RegisterNos: expandRange("7376241ME134", "7376241ME158")},

		// S.No 172 - WW 224 - B.E. MZ - 22MC404
		{HallNo: "WW 224", CourseCode: "22MC404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241MZ154", "7376241MZ160")...)
			r = append(r, expandRange("7376251MZ501", "7376251MZ506")...)
			return r
		}()},

		// S.No 173 - WW 224 - B.Tech. CB - 22CB404
		{HallNo: "WW 224", CourseCode: "22CB404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376242CB102", "7376242CB105")...)
			r = append(r, expandRange("7376242CB107", "7376242CB109")...)
			return r
		}()},

		// S.No 174 - WW 225 - B.E. EI - 22EI404
		{HallNo: "WW 225", CourseCode: "22EI404", RegisterNos: []string{
			"7376231EI128", "7376231EI143", "7376231EI159",
		}},

		// S.No 175 - WW 225 - B.E. ME - 22ME404
		{HallNo: "WW 225", CourseCode: "22ME404", RegisterNos: []string{"7376241ME501", "7376241ME505"}},

		// S.No 176 - WW 225 - B.E. EI - 22EI404
		{HallNo: "WW 225", CourseCode: "22EI404", RegisterNos: expandRange("7376241EI101", "7376241EI111")},

		// S.No 177 - WW 225 - B.E. ME - 22ME404
		{HallNo: "WW 225", CourseCode: "22ME404", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376241ME159")
			r = append(r, expandRange("7376251ME501", "7376251ME508")...)
			return r
		}()},

		// S.No 178 - WW 225 - B.Tech. CB - 22CB404
		{HallNo: "WW 225", CourseCode: "22CB404", RegisterNos: expandRange("7376242CB110", "7376242CB134")},

		// S.No 179 - WW 226 - B.E. EI - 22EI404
		{HallNo: "WW 226", CourseCode: "22EI404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EI112", "7376241EI125")...)
			r = append(r, expandRange("7376241EI127", "7376241EI137")...)
			return r
		}()},

		// S.No 180 - WW 226 - B.Tech. CB - 22CB404
		{HallNo: "WW 226", CourseCode: "22CB404", RegisterNos: expandRange("7376242CB135", "7376242CB159")},

		// S.No 181 - WW 227 - B.Tech. AG - 22AG404
		{HallNo: "WW 227", CourseCode: "22AG404", RegisterNos: []string{
			"7376222AG116", "7376222AG120", "7376222AG157", "7376222AG158",
		}},

		// S.No 182 - WW 227 - B.Tech. CB - 22CB404
		{HallNo: "WW 227", CourseCode: "22CB404", RegisterNos: []string{"7376242CB502", "7376242CB503"}},

		// S.No 183 - WW 227 - B.Tech. AG - 22AG404
		{HallNo: "WW 227", CourseCode: "22AG404", RegisterNos: []string{"7376232AG113", "7376232AG151"}},

		// S.No 184 - WW 227 - B.E. EI - 22EI404
		{HallNo: "WW 227", CourseCode: "22EI404", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376241EI138", "7376241EI160")...)
			r = append(r, "7376251EI501", "7376251EI502")
			return r
		}()},

		// S.No 185 - WW 227 - B.Tech. CB - 22CB404
		{HallNo: "WW 227", CourseCode: "22CB404", RegisterNos: expandRange("7376252CB501", "7376252CB503")},

		// S.No 186 - WW 227 - B.Tech. AG - 22AG404
		{HallNo: "WW 227", CourseCode: "22AG404", RegisterNos: expandRange("7376242AG101", "7376242AG114")},
	}
}

// buildSeatingData16AN returns all seating records from the 16-05-2026 AN exam
// Exam Date: 16-05-2026 | Session: AN - 01:30 PM to 04:30 PM
func buildSeatingData16AN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 101 - B.Tech. CB - 22CB306
		{HallNo: "EW 101", CourseCode: "22CB306", RegisterNos: []string{
			"7376242CB116", "7376242CB118", "7376242CB147", "7376242CB155",
		}},
	}
}
// LookupHall returns the hall number for a given register number and course code.
func LookupHall(registerNo, courseCode string) (string, bool) {
	registerNo = strings.TrimSpace(strings.ToUpper(registerNo))
	courseCode = strings.TrimSpace(strings.ToUpper(courseCode))

	allRecords := append(buildSeatingData11FN(), buildSeatingData11AN()...)
	allRecords = append(allRecords, buildSeatingData12FN()...)
	allRecords = append(allRecords, buildSeatingDataSession12AN()...)
	allRecords = append(allRecords, buildSeatingData13FN()...)
	allRecords = append(allRecords, buildSeatingData13AN()...)
	allRecords = append(allRecords, buildSeatingData14FN()...)
	allRecords = append(allRecords, buildSeatingData14AN()...)
	allRecords = append(allRecords, buildSeatingData15FN()...)
	allRecords = append(allRecords, buildSeatingData15AN()...)
	allRecords = append(allRecords, buildSeatingData16FN()...)
	allRecords = append(allRecords, buildSeatingData16AN()...)
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