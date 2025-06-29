(ns writer
  (:require [clojure.java.io :as io]))

(defn write-code!
  [code filename]
  (io/delete-file filename)
  (if (vector? code)
    (run! #(spit filename (str % "\n") :append true) code)
    (spit filename code)))
