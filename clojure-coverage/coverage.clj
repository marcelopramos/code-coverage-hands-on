(ns coverage
  (:require [reader :as r]
            [writer :as w]
            [ast :as a]
            [clojure.tools.analyzer.ast :as ast]))

; ----- GLOBAL "VARIABLE" form-counter -----
; declaration -> (def form-counter (atom 0))
; increment   -> (swap! form-counter inc)
; access      -> @form-counter
(def total-branches (atom 0))
(def executed-branches (atom #{}))

;; Just to create a "do" node with :statements and :ret
(defn dummy-do-increment-branch-executed
  [branch-id]
  (a/ast-from-code `(do (swap! coverage/executed-branches conj ~branch-id) 42)))

(defn instrument-node
  [node branch-id]
  (swap! coverage/total-branches inc)
  (-> (dummy-do-increment-branch-executed branch-id)
      (assoc :ret node)))

(defn visit-if
  [node]
  (let [then-node (:then node)
        else-node (:else node)
        then-branch-id (hash then-node)
        else-branch-id (hash else-node)]
    (-> node
        (assoc :then (instrument-node then-node then-branch-id))
        (cond-> (some? else-node)
                (assoc :else (instrument-node else-node else-branch-id))))))

(defn visit
  [node]
  (cond (= (:op node) :if)
        (visit-if node)

        :else
        node))

(defn instrument-ast
  [ast]
  (ast/prewalk ast visit))

(let [code (r/read-code! "code.clj") ;; 1. Read code
      ast (a/ast-from-code code) ;; 2. Generate AST from code
      ;; 3. Instrument AST
      instrumented-ast (instrument-ast ast)]
  (-> instrumented-ast
      a/ast-to-code
      (w/write-code! "instrumented-code.clj"))) ;; 4. Generate instrumented code

(load-file "instrumented-code.clj")

;; 5. Test
(assert (= (should-i-deploy-on "Friday") "How about Monday?"))
(assert (= (should-i-deploy-on "Monday") "Yes"))
(assert (= (should-i-deploy-on "Tuesday") "Yes"))
(assert (= (should-i-watch-this-movie "Shrek") "Yes"))

;; 6. Report
(println (str "Branch coverage: " (-> (count @executed-branches) (/ @total-branches) (* 100)) "%"))
