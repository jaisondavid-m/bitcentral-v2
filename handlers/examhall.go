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

func buildSeatingData01June2026FNAN() []models.SeatingRecord {
	return []models.SeatingRecord{
		// S.No 1 - EW 111 - B.Tech. AD - 22HS201
		{HallNo: "EW 111", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252AD101", "7376252AD104")...)
			r = append(r, expandRange("7376252AD106", "7376252AD116")...)
			return r
		}()},

		// S.No 2 - EW 111 - B.Tech. AG - 22HS201
		{HallNo: "EW 111", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252AG101", "7376252AG113")...)
			r = append(r, "7376252AG115", "7376252AG116")
			return r
		}()},

		// S.No 3 - EW 111 - B.Tech. AL - 22HS201
		{HallNo: "EW 111", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AL101", "7376252AL115")
		}()},

		// S.No 4 - EW 111 - B.E. CS - 22HS201
		{HallNo: "EW 111", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS101", "7376251CS115")
		}()},

		// S.No 5 - EW 112 - B.Tech. AD - 22HS201
		{HallNo: "EW 112", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD117", "7376252AD131")
		}()},

		// S.No 6 - EW 112 - B.Tech. AG - 22HS201
		{HallNo: "EW 112", CourseCode: "22HS201", RegisterNos: []string{
			"7376252AG117", "7376252AG118",
			"7376252AG120", "7376252AG121",
			"7376252AG122", "7376252AG123",
			"7376252AG124", "7376252AG125",
			"7376252AG126", "7376252AG127",
		}},

		// S.No 7 - EW 112 - B.Tech. BT - 22HS201
		{HallNo: "EW 112", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252BT102", "7376252BT106")
		}()},

		// S.No 8 - EW 112 - B.Tech. AL - 22HS201
		{HallNo: "EW 112", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376252AL116")
			r = append(r, expandRange("7376252AL118", "7376252AL125")...)
			r = append(r, expandRange("7376252AL127", "7376252AL132")...)
			return r
		}()},

		// S.No 9 - EW 112 - B.E. CS - 22HS201
		{HallNo: "EW 112", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS116", "7376251CS128")...)
			r = append(r, "7376251CS130", "7376251CS131")
			return r
		}()},

		// S.No 10 - EW 113 - B.Tech. AD - 22HS201
		{HallNo: "EW 113", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD132", "7376252AD146")
		}()},

		// S.No 11 - EW 113 - B.Tech. BT - 22HS201
		{HallNo: "EW 113", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252BT107", "7376252BT120")...)
			r = append(r, "7376252BT122")
			return r
		}()},

		// S.No 12 - EW 113 - B.Tech. AL - 22HS201
		{HallNo: "EW 113", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252AL133", "7376252AL145")...)
			r = append(r, "7376252AL147", "7376252AL148")
			return r
		}()},

		// S.No 13 - EW 113 - B.E. CS - 22HS201
		{HallNo: "EW 113", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS132", "7376251CS146")
		}()},

		// S.No 14 - EW 114 - B.Tech. AD - 22HS201
		{HallNo: "EW 114", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD147", "7376252AD161")
		}()},

		// S.No 15 - EW 114 - B.Tech. BT - 22HS201
		{HallNo: "EW 114", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252BT124", "7376252BT138")
		}()},

		// S.No 16 - EW 114 - B.Tech. AL - 22HS201
		{HallNo: "EW 114", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AL149", "7376252AL163")
		}()},

		// S.No 17 - EW 114 - B.E. CS - 22HS201
		{HallNo: "EW 114", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS147", "7376251CS155")...)
			r = append(r, expandRange("7376251CS157", "7376251CS161")...)
			r = append(r, "7376251CS163")
			return r
		}()},

		// S.No 18 - EW 115 - B.Tech. AD - 22HS201
		{HallNo: "EW 115", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD162", "7376252AD176")
		}()},

		// S.No 19 - EW 115 - B.Tech. BT - 22HS201
		{HallNo: "EW 115", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252BT139", "7376252BT153")
		}()},

		// S.No 20 - EW 115 - B.Tech. AL - 22HS201
		{HallNo: "EW 115", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AL164", "7376252AL178")
		}()},

		// S.No 21 - EW 115 - B.E. CS - 22HS201
		{HallNo: "EW 115", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS164", "7376251CS168")...)
			r = append(r, expandRange("7376251CS170", "7376251CS179")...)
			return r
		}()},

		// S.No 22 - EW 116 - B.Tech. AD - 22HS201
		{HallNo: "EW 116", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD177", "7376252AD191")
		}()},

		// S.No 23 - EW 116 - B.Tech. BT - 22HS201
		{HallNo: "EW 116", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252BT154", "7376252BT168")
		}()},

		// S.No 24 - EW 116 - B.Tech. AL - 22HS201
		{HallNo: "EW 116", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252AL179", "7376252AL187")...)
			r = append(r, expandRange("7376252AL189", "7376252AL194")...)
			return r
		}()},

		// S.No 25 - EW 116 - B.E. CS - 22HS201
		{HallNo: "EW 116", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS180", "7376251CS194")
		}()},

		// S.No 26 - EW 117 - B.Tech. AD - 22HS201
		{HallNo: "EW 117", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD192", "7376252AD206")
		}()},

		// S.No 27 - EW 117 - B.Tech. BT - 22HS201
		{HallNo: "EW 117", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252BT169", "7376252BT183")
		}()},

		// S.No 28 - EW 117 - B.Tech. AL - 22HS201
		{HallNo: "EW 117", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AL195", "7376252AL209")
		}()},

		// S.No 29 - EW 117 - B.E. CS - 22HS201
		{HallNo: "EW 117", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS195", "7376251CS209")
		}()},

		// S.No 30 - EW 118 - B.Tech. AD - 22HS201
		{HallNo: "EW 118", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD207", "7376252AD221")
		}()},

		// S.No 31 - EW 118 - B.Tech. BT - 22HS201
		{HallNo: "EW 118", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252BT184", "7376252BT197")...)
			r = append(r, "7376252BT199")
			return r
		}()},

		// S.No 32 - EW 118 - B.Tech. AL - 22HS201
		{HallNo: "EW 118", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AL210", "7376252AL224")
		}()},

		// S.No 33 - EW 118 - B.E. CS - 22HS201
		{HallNo: "EW 118", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS210", "7376251CS224")
		}()},

		// S.No 34 - EW 207 - B.Tech. AD - 22HS201
		{HallNo: "EW 207", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD222", "7376252AD236")
		}()},

		// S.No 35 - EW 207 - B.Tech. BT - 22HS201
		{HallNo: "EW 207", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252BT200", "7376252BT214")
		}()},

		// S.No 36 - EW 207 - B.Tech. AL - 22HS201
		{HallNo: "EW 207", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AL225", "7376252AL239")
		}()},

		// S.No 37 - EW 207 - B.E. CS - 22HS201
		{HallNo: "EW 207", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS225", "7376251CS228")...)
			r = append(r, expandRange("7376251CS231", "7376251CS241")...)
			return r
		}()},

		// S.No 38 - EW 208 - B.Tech. AD - 22HS201
		{HallNo: "EW 208", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252AD237", "7376252AD247")...)
			r = append(r, expandRange("7376252AD249", "7376252AD252")...)
			return r
		}()},

		// S.No 39 - EW 208 - B.Tech. BT - 22HS201
		{HallNo: "EW 208", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252BT215", "7376252BT224")
		}()},

		// S.No 40 - EW 208 - B.Tech. IT - 22HS201
		{HallNo: "EW 208", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT102", "7376252IT106")
		}()},

		// S.No 41 - EW 208 - B.Tech. AL - 22HS201
		{HallNo: "EW 208", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AL240", "7376252AL246")
		}()},

		// S.No 42 - EW 208 - B.E. EC - 22HS201
		{HallNo: "EW 208", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC101", "7376251EC108")
		}()},

		// S.No 43 - EW 208 - B.E. CS - 22HS201
		{HallNo: "EW 208", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS242", "7376251CS256")
		}()},

		// S.No 44 - EW 209 - B.Tech. AD - 22HS201
		{HallNo: "EW 209", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD253", "7376252AD267")
		}()},

		// S.No 45 - EW 209 - B.Tech. IT - 22HS201
		{HallNo: "EW 209", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT107", "7376252IT121")
		}()},

		// S.No 46 - EW 209 - B.E. EC - 22HS201
		{HallNo: "EW 209", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC109", "7376251EC123")
		}()},

		// S.No 47 - EW 209 - B.E. CS - 22HS201
		{HallNo: "EW 209", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS257", "7376251CS271")
		}()},

		// S.No 48 - EW 213 - B.Tech. AD - 22HS201
		{HallNo: "EW 213", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD268", "7376252AD282")
		}()},

		// S.No 49 - EW 213 - B.Tech. IT - 22HS201
		{HallNo: "EW 213", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT122", "7376252IT136")
		}()},

		// S.No 50 - EW 213 - B.E. EC - 22HS201
		{HallNo: "EW 213", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC124", "7376251EC138")
		}()},

		// S.No 51 - EW 213 - B.E. CS - 22HS201
		{HallNo: "EW 213", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS272", "7376251CS286")
		}()},

		// S.No 52 - EW 214 - B.Tech. AD - 22HS201
		{HallNo: "EW 214", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD283", "7376252AD297")
		}()},

		// S.No 53 - EW 214 - B.Tech. IT - 22HS201
		{HallNo: "EW 214", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT137", "7376252IT151")
		}()},

		// S.No 54 - EW 214 - B.E. EC - 22HS201
		{HallNo: "EW 214", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC139", "7376251EC153")
		}()},

		// S.No 55 - EW 214 - B.E. CS - 22HS201
		{HallNo: "EW 214", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS287", "7376251CS301")
		}()},

		// S.No 56 - EW 215 - B.Tech. AD - 22HS201
		{HallNo: "EW 215", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD298", "7376252AD312")
		}()},

		// S.No 57 - EW 215 - B.Tech. IT - 22HS201
		{HallNo: "EW 215", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252IT152", "7376252IT164")...)
			r = append(r, "7376252IT166", "7376252IT167")
			return r
		}()},

		// S.No 58 - EW 215 - B.E. EC - 22HS201
		{HallNo: "EW 215", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC154", "7376251EC168")
		}()},

		// S.No 59 - EW 215 - B.E. CS - 22HS201
		{HallNo: "EW 215", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251CS302", "7376251CS313")...)
			r = append(r, expandRange("7376251CS315", "7376251CS317")...)
			return r
		}()},

		// S.No 60 - WW 005 - B.Tech. AD - 22HS201
		{HallNo: "WW 005", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD313", "7376252AD327")
		}()},

		// S.No 61 - WW 005 - B.Tech. IT - 22HS201
		{HallNo: "WW 005", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT168", "7376252IT182")
		}()},

		// S.No 62 - WW 005 - B.E. EC - 22HS201
		{HallNo: "WW 005", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC169", "7376251EC183")
		}()},

		// S.No 63 - WW 005 - B.E. CS - 22HS201
		{HallNo: "WW 005", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS318", "7376251CS332")
		}()},

		// S.No 64 - WW 006 - B.Tech. AD - 22HS201
		{HallNo: "WW 006", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD328", "7376252AD342")
		}()},

		// S.No 65 - WW 006 - B.Tech. IT - 22HS201
		{HallNo: "WW 006", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT183", "7376252IT197")
		}()},

		// S.No 66 - WW 006 - B.E. EC - 22HS201
		{HallNo: "WW 006", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC184", "7376251EC198")
		}()},

		// S.No 67 - WW 006 - B.E. CS - 22HS201
		{HallNo: "WW 006", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS333", "7376251CS347")
		}()},

		// S.No 68 - WW 007 - B.Tech. AD - 22HS201
		{HallNo: "WW 007", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD343", "7376252AD357")
		}()},

		// S.No 69 - WW 007 - B.Tech. IT - 22HS201
		{HallNo: "WW 007", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376252IT198", "7376252IT201")...)
			r = append(r, expandRange("7376252IT203", "7376252IT213")...)
			return r
		}()},

		// S.No 70 - WW 007 - B.E. EC - 22HS201
		{HallNo: "WW 007", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251EC199", "7376251EC204")...)
			r = append(r, expandRange("7376251EC206", "7376251EC214")...)
			return r
		}()},

		// S.No 71 - WW 007 - B.E. CS - 22HS201
		{HallNo: "WW 007", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS348", "7376251CS362")
		}()},

		// S.No 72 - WW 008 - B.Tech. AD - 22HS201
		{HallNo: "WW 008", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD358", "7376252AD372")
		}()},

		// S.No 73 - WW 008 - B.Tech. IT - 22HS201
		{HallNo: "WW 008", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT214", "7376252IT228")
		}()},

		// S.No 74 - WW 008 - B.E. EC - 22HS201
		{HallNo: "WW 008", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC215", "7376251EC229")
		}()},

		// S.No 75 - WW 008 - B.E. CS - 22HS201
		{HallNo: "WW 008", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS363", "7376251CS377")
		}()},

		// S.No 76 - WW 011 - B.Tech. AD - 22HS201
		{HallNo: "WW 011", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252AD373", "7376252AD381")
		}()},

		// S.No 77 - WW 011 - B.E. EE - 22HS201
		{HallNo: "WW 011", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EE102", "7376251EE107")
		}()},

		// S.No 78 - WW 011 - B.Tech. IT - 22HS201
		{HallNo: "WW 011", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT229", "7376252IT243")
		}()},

		// S.No 79 - WW 011 - B.E. EC - 22HS201
		{HallNo: "WW 011", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC230", "7376251EC244")
		}()},

		// S.No 80 - WW 011 - B.E. CS - 22HS201
		{HallNo: "WW 011", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS378", "7376251CS392")
		}()},

		// S.No 81 - WW 012 - B.E. EE - 22HS201
		{HallNo: "WW 012", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251EE108", "7376251EE116")...)
			r = append(r, expandRange("7376251EE118", "7376251EE123")...)
			return r
		}()},

		// S.No 82 - WW 012 - B.Tech. IT - 22HS201
		{HallNo: "WW 012", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT244", "7376252IT258")
		}()},

		// S.No 83 - WW 012 - B.E. EC - 22HS201
		{HallNo: "WW 012", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC245", "7376251EC259")
		}()},

		// S.No 84 - WW 012 - B.E. CS - 22HS201
		{HallNo: "WW 012", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS393", "7376251CS407")
		}()},

		// S.No 85 - WW 218 - B.E. EE - 22HS201
		{HallNo: "WW 218", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251EE124", "7376251EE135")...)
			r = append(r, "7376251EE137")
			r = append(r, "7376251EE139", "7376251EE140")
			return r
		}()},

		// S.No 86 - WW 218 - B.Tech. IT - 22HS201
		{HallNo: "WW 218", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT259", "7376252IT273")
		}()},

		// S.No 87 - WW 218 - B.E. EC - 22HS201
		{HallNo: "WW 218", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC260", "7376251EC274")
		}()},

		// S.No 88 - WW 218 - B.E. CS - 22HS201
		{HallNo: "WW 218", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS408", "7376251CS422")
		}()},

		// S.No 89 - WW 219 - B.E. EE - 22HS201
		{HallNo: "WW 219", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251EE141", "7376251EE142")...)
			r = append(r, expandRange("7376251EE144", "7376251EE151")...)
			r = append(r, "7376251EE153")
			r = append(r, expandRange("7376251EE155", "7376251EE158")...)
			return r
		}()},

		// S.No 90 - WW 219 - B.Tech. IT - 22HS201
		{HallNo: "WW 219", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT274", "7376252IT288")
		}()},

		// S.No 91 - WW 219 - B.E. EC - 22HS201
		{HallNo: "WW 219", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC275", "7376251EC289")
		}()},

		// S.No 92 - WW 219 - B.E. CS - 22HS201
		{HallNo: "WW 219", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS423", "7376251CS437")
		}()},

		// S.No 93 - EW 218 - B.E. EE - 22HS201
		{HallNo: "EW 218", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251EE159", "7376251EE162")...)
			r = append(r, expandRange("7376251EE165", "7376251EE180")...)
			r = append(r, expandRange("7376251EE182", "7376251EE191")...)
			return r
		}()},

		// S.No 94 - EW 218 - B.Tech. IT - 22HS201
		{HallNo: "EW 218", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT289", "7376252IT318")
		}()},

		// S.No 95 - EW 218 - B.E. EC - 22HS201
		{HallNo: "EW 218", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC290", "7376251EC319")
		}()},

		// S.No 96 - EW 218 - B.E. CS - 22HS201
		{HallNo: "EW 218", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS438", "7376251CS467")
		}()},

		// S.No 97 - WW 222 - B.E. EE - 22HS201
		{HallNo: "WW 222", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251EE192", "7376251EE197")...)
			r = append(r, expandRange("7376251EE199", "7376251EE205")...)
			return r
		}()},

		// S.No 98 - WW 222 - B.E. ME - 22HS201
		{HallNo: "WW 222", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251ME102", "7376251ME113")
		}()},

		// S.No 99 - WW 222 - B.Tech. IT - 22HS201
		{HallNo: "WW 222", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT319", "7376252IT343")
		}()},

		// S.No 100 - WW 222 - B.E. EC - 22HS201
		{HallNo: "WW 222", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251EC320", "7376251EC327")...)
			r = append(r, expandRange("7376251EC329", "7376251EC345")...)
			return r
		}()},

		// S.No 101 - WW 222 - B.E. CS - 22HS201
		{HallNo: "WW 222", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251CS468", "7376251CS479")
		}()},

		// S.No 102 - WW 222 - B.E. MZ - 22HS201
		{HallNo: "WW 222", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251MZ101", "7376251MZ103")...)
			r = append(r, expandRange("7376251MZ106", "7376251MZ115")...)
			return r
		}()},

		// S.No 103 - WW 223 - B.E. ME - 22HS201
		{HallNo: "WW 223", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251ME114", "7376251ME118")...)
			r = append(r, expandRange("7376251ME120", "7376251ME139")...)
			return r
		}()},

		// S.No 104 - WW 223 - B.Tech. IT - 22HS201
		{HallNo: "WW 223", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT344", "7376252IT368")
		}()},

		// S.No 105 - WW 223 - B.E. EC - 22HS201
		{HallNo: "WW 223", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EC346", "7376251EC352")
		}()},

		// S.No 106 - WW 223 - B.E. EI - 22HS201
		{HallNo: "WW 223", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EI101", "7376251EI118")
		}()},

		// S.No 107 - WW 223 - B.E. MZ - 22HS201
		{HallNo: "WW 223", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251MZ116", "7376251MZ128")...)
			r = append(r, expandRange("7376251MZ130", "7376251MZ141")...)
			return r
		}()},

		// S.No 108 - WW 224 - B.E. ME - 22HS201
		{HallNo: "WW 224", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, "7376251ME140", "7376251ME141")
			r = append(r, expandRange("7376251ME143", "7376251ME160")...)
			return r
		}()},

		// S.No 109 - WW 224 - B.Tech. IT - 22HS201
		{HallNo: "WW 224", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376252IT369", "7376252IT388")
		}()},

		// S.No 110 - WW 224 - B.E. EI - 22HS201
		{HallNo: "WW 224", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251EI119", "7376251EI133")...)
			r = append(r, expandRange("7376251EI135", "7376251EI141")...)
			r = append(r, expandRange("7376251EI143", "7376251EI145")...)
			return r
		}()},

		// S.No 111 - WW 224 - B.E. MZ - 22HS201
		{HallNo: "WW 224", CourseCode: "22HS201", RegisterNos: func() []string {
			var r []string
			r = append(r, expandRange("7376251MZ142", "7376251MZ145")...)
			r = append(r, expandRange("7376251MZ147", "7376251MZ162")...)
			return r
		}()},

		// S.No 112 - WW 225 - B.E. EI - 22HS201
		{HallNo: "WW 225", CourseCode: "22HS201", RegisterNos: func() []string {
			return expandRange("7376251EI146", "7376251EI161")
		}()},
	}
}

// LookupHall returns the hall number for a given register number and course code.
func LookupHall(registerNo, courseCode string) (string, bool) {
	registerNo = strings.TrimSpace(strings.ToUpper(registerNo))
	courseCode = strings.TrimSpace(strings.ToUpper(courseCode))

	allRecords := buildSeatingData01June2026FNAN()
	
	
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
