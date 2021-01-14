window.onload = () => {
    const airtableApiKey = config.AIRTABLE_API_KEY
    const airtableApiUrl = `https://api.airtable.com/v0/appa15zHyA17clIvj/shopping-list`

    const dateList = document.getElementById("history")
    const onButton = document.getElementById("on")
    const offButton = document.getElementById("off")
    const passwordInput = document.getElementById("password-input")
    const lighthouseImage = document.getElementById("lighthouse-image")

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
        if (dates.length === 0) return

        const lastDate = dates[dates.length - 1]

        dateList.innerHTML = ""

        dates.forEach(date => {
            const newDate = createDateListElement(date.fields.item)
            dateList.append(newDate)
        })

        if (lastDate.fields.status === "on") {
            lighthouseImage.src = "./images/lighthouse-animation.gif"

            onButton.classList.add("hidden")
            offButton.classList.remove("hidden")
        }

        if (lastDate.fields.status === "off") {
            lighthouseImage.src = "./images/lighthouse-still.gif"

            offButton.classList.add("hidden")
            onButton.classList.remove("hidden")
        }
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
                    "date": newDate.toISOString(),
                    "status": action
                }
            }).then(response => {
                getDates()
            }).catch(error => {
                console.log(error);
            });
    }

    function checkPassword(correctPasswordHash) {
        const enteredPassword = passwordInput.value
        const enteredPasswordHash = new Hashes.SHA256().hex(enteredPassword)
        return enteredPasswordHash === correctPasswordHash
    }

    onButton.addEventListener("click", event => {
        const correctPasswordHash = "9c92ff7dc64ffbb34bc2db4996c355c7eba551cd4f503e91430b905c81bbbbde"

        if (checkPassword(correctPasswordHash)) {
            addDate("on")
        } else {
            passwordInput.classList.add("shake")

            setTimeout(function() {
                passwordInput.classList.remove("shake")
            }, 1000)
        }
    })

    offButton.addEventListener("click", event => {
        const correctPasswordHash = "acba1829668bd8d6c9b68d9a091b612e028a776ddee8a2daf194195a7b98d2af"

        if (checkPassword(correctPasswordHash)) {
            addDate("off")
        } else {
            passwordInput.classList.add("shake")
        }
    })
}