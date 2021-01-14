window.onload = () => {
    const airtableApiKey = config.AIRTABLE_API_KEY
    const airtableApiUrl = `https://api.airtable.com/v0/appa15zHyA17clIvj/shopping-list`

    const dateList = document.getElementById("history")
    const onButton = document.getElementById("on")
    const offButton = document.getElementById("off")

    const dates = []

    init()

    function init() {
        getDates()
    }

    function getDates() {
        // Parameters for returning sorted dates.
        const queryString = "sort%5B0%5D%5Bfield%5D=date&sort%5B0%5D%5Bdirection%5D=asc"

        axios.get(airtableApiUrl + `?api_key=${airtableApiKey}&${queryString}`)
            .then(response => {
                populateDateList(response.data.records)
            })
            .catch(error => {
                console.log(error)
            })
    }

    function populateDateList(dates) {
        dateList.innerHTML = ""

        dates.forEach(date => {
            const newDate = createDateListElement(date.fields.item)
            dateList.append(newDate)
        })

        // const lastDate = dates[dates.length - 1].fields.item
    }

    function createDateListElement(date) {
        const newItem = document.createElement("li")
        newItem.innerText = date
        return newItem
    }

    function addDate(action) {
        const newDate = new Date()
        const emoji = action === "on" ? "🔥" : "🧯"
        const hours = newDate.getHours()
        const minutes = `${newDate.getMinutes() < 10 ? "0" : ""}${newDate.getMinutes()}`
        const dateString = newDate.toDateString()

        const newDateText = `${emoji} Turned ${action} at ${hours}:${minutes} on ${dateString}`

        axios.post(airtableApiUrl + `?api_key=${airtableApiKey}`, {
                "fields": {
                    "item": newDateText,
                    "date": newDate.toISOString()
                }
            }).then(response => {
                getDates()
            }).catch(error => {
                console.log(error);
            });
    }

    onButton.addEventListener("click", event => {
        addDate("on")
    })

    offButton.addEventListener("click", event => {
        addDate("off")
    })
}