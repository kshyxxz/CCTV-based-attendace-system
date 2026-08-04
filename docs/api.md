## Student APIs:

use /students as url prefix

| Method |  Endpoint   |   Description    |
| :----: | :---------: | :--------------: |
|  GET   |     `/`     | Get all students |
|  GET   | `/<rollno>` |  Get a student   |
|  POST  |  `/create`  | Create a student |
|  PUT   |     `/`     | Update a student |
| DELETE |     `/`     | Delete a student |

### GET `/` : output

```json
[
	{
		"address": "Pokhara",
		"class_name": "A-101",
		"embedding": false,
		"name": "Sanjay Khadka",
		"phone": "9841000002",
		"rollno": "NCE080BCT002"
	},
	{
		"address": "Lalitpur",
		"class_name": "A-101",
		"embedding": false,
		"name": "Prabin Adhikari",
		"phone": "9841000003",
		"rollno": "NCE080BCT003"
	}
]
```

### GET `/<rollno>` : output

```json
{
	"address": "Gulmi",
	"attendance_stats": [
		{
			"count": 0,
			"subject": "Artificial Intelligence"
		},
		{
			"count": 0,
			"subject": "Data Communication"
		},
		{
			"count": 0,
			"subject": "Engineering Mathematics II"
		},
		{
			"count": 1,
			"subject": "Data Com"
		}
	],
	"class_name": "A-101",
	"embedding": true,
	"name": "Loblesh Bhartal",
	"phone": "9876543210",
	"rollno": "NCE080BCT022"
}
```

### POST `/create` : input

form input

```
|   Key   | Type |      Value       |
| :-----: | :--: | :--------------: |
| rollno  | text |   NCE080BCT001   |
|  fname  | text |      Aavash      |
|  lname  | text |      Tiwari      |
|  phone  | text |    9876543210    |
| address | text |    Kathmandu     |
|  photo  | file | NCE080BCT001.jpg |
```

### PUT `/` : input

```json
{
	"rollno": "NCE080BCT103",
	"fname": "Nylon",
	"lname": "Sharma",
	"class_name": "A-101",
	"phone": 9845118910,
	"address": "Bhaktapur"
}
```

### DELETE `/` : input

```json
{
	"rollno": "NCE080BCT103"
}
```

## Class APIs:

use /classes as url prefix

| Method | Endpoint |   Description   |
| :----: | :------: | :-------------: |
|  GET   |   `/`    | Get all classes |
|  POST  |   `/`    |  Create class   |
|  PUT   |   `/`    |  Update class   |
| DELETE |   `/`    |  Delete class   |

### GET `/` : output

```json
[
	{
		"class_name": "A-101",
		"camera_source": "0"
	},
	{
		"class_name": "A-103",
		"camera_source": "rtsp://192.168.1.50:554/stream"
	},
	{
		"class_name": "A-104",
		"camera_source": "0"
	},
	{
		"class_name": "A-105",
		"camera_source": "0"
	}
]
```

### POST `/` : input

```json
{
	"class_name": "A-100",
	"camera_source": "0"
}
```

### PUT `/` : input

```json
{
	"class_name": "A-100",
	"new_class_name": "A-109",
	"camera_source": "rtsp://192.168.1.50:554/stream"
}
```

### DELETE `/` : input

```json
{
	"class_name": "A-100"
}
```

### PUT `/<class_id>/camera-source` : input

```json
{
	"class_id": 1,
	"camera_source": "rtsp://admin:admin123@1xx.1xx.1.1x:1xx/1xx"
}
```

## Subject APIs:

use /subjects as url prefix

| Method | Endpoint |   Description    |
| :----: | :------: | :--------------: |
|  GET   |   `/`    | Get all subjects |
|  POST  |   `/`    |  Create subject  |
|  PUT   |   `/`    |  Update subject  |
| DELETE |   `/`    |  Delete subject  |

### GET `/` : output

```json
[
	{
		"subject_code": "ENCT351",
		"subject_id": 1,
		"subject_name": "Artificial Intelligence"
	},
	{
		"subject_code": "ENCT205",
		"subject_id": 2,
		"subject_name": "Data Communication"
	}
]
```

### POST `/` : input

```json
{
	"subject_name": "Data Communication",
	"subject_code": "ENEX203"
}
```

### PUT `/` : input

```json
{
	"subject_id": "3",
	"new_subject_code": "ENCT303", // either code or name or both
	"new_subject_name": "Data Communication"
}
```

### DELETE `/` : input

```json
{
	"subject_id": "2"
}
```

## Dashboard API:

use /dashboard as url prefix

| Method | Endpoint | Description |
| :----: | :------: | :---------: |
|  GET   |   `/`    | Get summary |

### GET `/` : output

```json
{
	"subject_distribution": [
		{
			"count": 45,
			"subject": "Artificial Intelligence"
		},
		{
			"count": 89,
			"subject": "Data Communication"
		},
		{
			"count": 12,
			"subject": "Engineering Mathematics II"
		}
	],
	"today": {
		"absent": 12,
		"attendance_rate": 0.95,
		"present": 228
	},
	"weekly_trend": [
		{
			"date": "2026-07-20",
			"rate": 0.89
		},
		{
			"date": "2026-07-21",
			"rate": 0.78
		},
		{
			"date": "2026-07-22",
			"rate": 0.8
		},
		{
			"date": "2026-07-23",
			"rate": 0.87
		},
		{
			"date": "2026-07-24",
			"rate": 0.76
		}
	]
}
```

## Timetable APIs:

use /timetable as url prefix

| Method |        Endpoint        |          Description           |
| :----: | :--------------------: | :----------------------------: |
|  GET   |    `/<class_name>/`    |  Get timetable for that class  |
|  POST  | `/<class_name>/create` | Create a period for that class |
|  PUT   |    `/<class_name>/`    | Update a period for that class |
| DELETE |    `/<class_name>/`    | Delete a period for that class |

### GET `/<class_name> : output

```json
{
	"Friday": [
		{
			"end_time": "11:00:00",
			"start_time": "10:00:00",
			"subject_name": "Artificial Intelligence",
			"timetable_id": 18
		}
	],
	"Monday": [
		{
			"end_time": "10:30:00",
			"start_time": "07:45:00",
			"subject_name": "Artificial Intelligence",
			"timetable_id": 1
		},
		{
			"end_time": "09:00:00",
			"start_time": "08:00:00",
			"subject_name": "Artificial Intelligence",
			"timetable_id": 11
		},
		{
			"end_time": "10:00:00",
			"start_time": "09:00:00",
			"subject_name": "Artificial Intelligence",
			"timetable_id": 12
		}
	],
	"Thursday": [
		{
			"end_time": "09:00:00",
			"start_time": "08:00:00",
			"subject_name": "Artificial Intelligence",
			"timetable_id": 17
		}
	],
	"Tuesday": [
		{
			"end_time": "09:30:00",
			"start_time": "08:00:00",
			"subject_name": "Artificial Intelligence",
			"timetable_id": 13
		},
		{
			"end_time": "11:00:00",
			"start_time": "10:00:00",
			"subject_name": "Artificial Intelligence",
			"timetable_id": 14
		}
	],
	"Wednesday": [
		{
			"end_time": "09:30:00",
			"start_time": "08:30:00",
			"subject_name": "Artificial Intelligence",
			"timetable_id": 15
		},
		{
			"end_time": "10:30:00",
			"start_time": "09:30:00",
			"subject_name": "Artificial Intelligence",
			"timetable_id": 16
		}
	]
}
```

### POST `/<class_name>/create` : input

```json
{
	"class_name": "A-101",
	"subject_code": "ENSH105",
	"day_of_week": "Sunday",
	"start_time": "07:45:00",
	"end_time": "09:00:00"
}
```

### PUT `/<class_name>/` : input

```json
{
	"timetable_id": "1",
	"subject_code": "ENSH105"
}
```

### DELETE `/<class_name>/` : input

```json
{
	"timetable_id": "1"
}
```

## Attendance API:

use /attendance as url prefix

### GET `/` : output

```json
[
	{
		"attendance_date": "2026-07-27",
		"rollno": "NCE080BCT020",
		"status": "Present",
		"student_name": "Kshitiz Shrestha",
		"subject_name": "Artificial Intelligence"
	},
	{
		"attendance_date": "2026-07-28",
		"rollno": "NCE080BCT020",
		"status": "Present",
		"student_name": "Kshitiz Shrestha",
		"subject_name": "Data Com"
	},
	{
		"attendance_date": "2026-07-28",
		"rollno": "NCE080BCT022",
		"status": "Present",
		"student_name": "Loblesh Bhartal",
		"subject_name": "Data Com"
	}
]
```

### Recognition API:

use /recognition as url prefix

For class-wise live recognition, send the selected class identifier with the request and make sure the class has a camera source configured on the class record. The backend uses that value to open the correct livestream.

### POST `/` : input

```json
[
	{
		"image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...",
		"selectedClass": "Subject_Name"
	}
]
```

### POST `/` :output

```json
[
	{
		"success": true,
		"detections": [
			{
				"box": [100, 60, 90, 110],
				"recognized": true,
				"rollno": "NCE080BCT002",
				"similarity": 0.9452
			}
		],
		"logs": [
			{
				"accuracy": "94.5%",
				"id": "log-1722428400-0",
				"name": "Sanjay Khadka",
				"roll": "NCE080BCT002",
				"status": "Recognized",
				"time": "04:35:15 PM"
			}
		],
		"stats": {
			"detected": 1,
			"fps": "24.5",
			"recognized": 1,
			"unknown": 0
		}
	}
]
```
