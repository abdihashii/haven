# Product Requirement Document: Haven

"The Second Brain for Your Home"

---

## 1. The Vision

Homeownership relies on "Tribal Knowledge" (stuff only you know) and fragile memory. This causes stress, nagging, and forgotten maintenance.

Haven is an **Async Home Operating System**. It is the single source of truth for the physical state of your house. It allows you to:

1. **Offload Memory:** "I don't need to remember the filter size; Haven knows."
2. **Eliminate Friction:** "I don't need to ask if the salt is full; I check the log."
3. **Disaster Proof:** "If I'm not home, my family can find the water shutoff in 10 seconds."

---

## 2. The Scope (SLC: Simple, Lovable, Complete)

- **Simple:** We track Assets, Tasks, and Supplies. No complex depreciation math.
- **Lovable:** The Onboarding pays for itself immediately ("The Hardware Store Audit"). The UI is instant.
- **Complete:** The full loop exists: Capture -> Schedule -> Notify -> Resolve.

---

## 3. User Flows

### A. The Onboarding Flow ("The Hardware Store Audit")

We replace "Data Entry" with a "Safety & Supply Audit."

```mermaid
graph TD
    Start[User Sign Up] --> Intro[Screen: 'Secure Your Home']

    Intro --> Step1[Step 1: Safety Audit]
    Step1 -->|Snap Photo| Shutoff[Main Water Shutoff]
    Step1 -->|Snap Photo| Breaker[Breaker Panel]

    Shutoff --> Step2[Step 2: The Hardware Store Cheat Sheet]
    Breaker --> Step2
    Step2 -->|Input| Filter[HVAC Filter Size]
    Step2 -->|Input| Fridge[Fridge Filter Type]
    Step2 -->|Input| Batt[Smoke Detector Battery]

    Step2 --> Step3[Step 3: Asset Inventory]
    Step3 -->|Select Templates| Auto[Auto-Schedule Tasks]

    Auto --> Dashboard[Dashboard: 'Home Intelligence: 20%']
```

### B. The "Quick Capture" Loop (Inbox Zero for Home)

You see an issue. You don't have time to fix it. You capture it.

```mermaid
sequenceDiagram
    autonumber
    actor U as Homeowner
    participant App as Haven App
    participant Backend as Backend

    U->>App: Tap giant "+" Button
    App->>U: Prompt: "Photo, Voice, or Text?"
    U->>App: Snaps photo of cracked caulk around tub

    App->>Backend: Submit Capture (Photo)
    Backend->>Backend: Create Inbox Item (Status: Untriaged)

    note right of Backend: Later...

    U->>App: Review Inbox
    App->>U: View Photo
    U->>App: Convert to Task -> Link to 'Bathtub' Asset
```

### C. The Maintenance Loop (Automated)

The system reminds you to do the work.

```mermaid
sequenceDiagram
    participant S as Reminder System
    participant U as User
    participant App as Haven App

    S->>U: Notification: "HVAC Filter Due"

    U->>U: Buys Filter (using App for size) & Installs
    U->>App: Click "Mark Done"
    App->>App: Log History & Reset Due Date (+90 Days)
```

---

## 4. Data Model (Conceptual)

The data model is designed for multi-tenancy (You + Parents) and deep asset history.

```mermaid
erDiagram
    USER ||--o{ PROPERTY : owns
    PROPERTY ||--o{ ZONE : contains
    ZONE ||--o{ ASSET : contains

    ASSET ||--o{ TASK : requires
    ASSET ||--o{ SUPPLY : consumes
    ASSET ||--o{ LOG : history
    ASSET ||--o{ DOCUMENT : manuals

    INBOX_ITEM }|--|| USER : captured_by

    ASSET {
        string name "Trane Furnace"
        json metadata "model, serial, etc."
    }

    SUPPLY {
        string name "Filter 20x25x4"
        string purchase_link "amazon.com/..."
    }

    TASK {
        string name "Replace Filter"
        date next_due_at
        string recurrence "Every 3 months"
    }
```

---

## 5. UI Wireframes

**Screen 1: The Onboarding (Step 2)**

**Goal:** Solve the "Hardware Store Amnesia" problem.

```plaintext
+-------------------------------------------------------+
|  < Back          Step 2 of 3                          |
+-------------------------------------------------------+
|  THE "HARDWARE STORE" CHEAT SHEET                     |
|                                                       |
|  Stop guessing at the store. Log your sizes now.      |
|                                                       |
|  HVAC Filter Size                                     |
|  [ 16 x 25 x 1       v ] (Select or Type)             |
|                                                       |
|  Refrigerator Water Filter                            |
|  [ Samsung HAF-QIN   v ] (Auto-suggest based on brand)|
|                                                       |
|  Smoke Detector Battery Type                          |
|  [ 9V / AA / Hardwired ]                              |
|                                                       |
|  [  Next: The Big Hardware  ]                         |
+-------------------------------------------------------+
```

**Screen 2: The Dashboard (Homeowner View)**

**Goal:** High-level status and quick capture.

```plaintext
+-------------------------------------------------------+
|  [ Menu ]          HAVEN: Mundelein        [ Profile ]|
+-------------------------------------------------------+
|  MY WEEKEND LIST                                      |
|  [ ] Flush Water Heater (Est: 45m)                    |
|  [ ] Change Furnace Filter (Est: 5m)                  |
|  [See All Tasks >]                                    |
+-------------------------------------------------------+
|                                                       |
|           [  BIG CAPTURE BUTTON (+)  ]                |
|           "Log an issue or idea..."                   |
|                                                       |
+-------------------------------------------------------+
|  HOUSE HEALTH                                         |
|  🟢 HVAC System     🟢 Plumbing     🟡 Garage Door     |
+-------------------------------------------------------+
|  RECENT LOGS                                          |
|  - Replaced Kitch. Faucet (You, Yesterday)            |
|  - Added Salt (Dad, 2 days ago)                       |
+-------------------------------------------------------+
```

**Screen 3: Asset Detail (The "Supplies" View)**

**Goal:** One-tap purchasing of the right part.

```plaintext
+-------------------------------------------------------+
|  < Back             Asset Detail             [ Edit ] |
+-------------------------------------------------------+
|  Trane XC95 Furnace                                   |
|  Location: Basement Utility Room                      |
|  Status: 🟢 Operational                               |
+-------------------------------------------------------+
|  CONSUMABLES (What to buy)                            |
|  +-------------------------------------------------+  |
|  | Filter: 20x25x4 MERV 11                         |  |
|  | [ Buy on Amazon ]  [ Buy at Store ]             |  |
|  +-------------------------------------------------+  |
|  +-------------------------------------------------+  |
|  | Flame Sensor: #SEN01114                         |  |
|  | [ Buy on RepairClinic ]                         |  |
|  +-------------------------------------------------+  |
+-------------------------------------------------------+
|  SERVICE HISTORY                                      |
|  - Feb 2026: Filter Change (Regular Maint.)           |
|  - Nov 2025: Cleaned Flame Sensor (Issue Fixed)       |
+-------------------------------------------------------+
```
