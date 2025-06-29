(defn should-i-deploy-on [day-of-week]
  (if (= day-of-week "Friday")
    "How about Monday?"
    "Yes"))

(defn should-i-watch-this-movie [movie]
  (if (= movie "Joker")
    "What about Twilight...?"
    "Yes"))
