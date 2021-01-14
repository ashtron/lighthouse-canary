window.onload = () => {
    const airtableApiKey = config.AIRTABLE_API_KEY
    const airtableApiUrl = `https://api.airtable.com/v0/appa15zHyA17clIvj/shopping-list`

    const dateList = document.getElementById("history")
    const onButton = document.getElementById("on")
    const offButton = document.getElementById("off")

    const dates = []

    getDates()

    function getDates() {
        axios.get(airtableApiUrl + `?api_key=${airtableApiKey}`)
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
                    "item": newDateText
                }
            }).then(response => {
                getDates()
            }).catch(error => {
                console.log(error);
            });
    }

    onButton.addEventListener("click", event => {
        addDate("on")
        // getDates()
    })

    offButton.addEventListener("click", event => {
        addDate("off")
    })
}

// const date = new Date()
// `Turned on at ${date.getHours()}:${date.getMinutes()} on ${date.toDateString()}`