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

- Simple: We track Assets, Tasks, and Supplies. No complex depreciation math.
- Lovable: The Onboarding pays for itself immediately ("The Home Depot Audit"). The UI is instant (Edge-cached).
- Complete: The full loop exists: Capture -> Schedule -> Notify -> Resolve.

---

## 3. User Flows & Architecture

### A. The Onboarding Flow ("The Home Depot Audit")

We replace "Data Entry" with a "Safety & Supply Audit."

```mermaid
graph TD
    Start[User Sign Up] --> Intro[Screen: 'Secure Your Home']

    Intro --> Step1[Step 1: Safety Audit]
    Step1 -->|Snap Photo| Shutoff[Main Water Shutoff]
    Step1 -->|Snap Photo| Breaker[Breaker Panel]

    Shutoff --> Step2[Step 2: The Home Depot Cheat Sheet]
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
    participant FE as App (PWA)
    participant G as Edge API (Cloudflare)
    participant DB as Database

    U->>FE: Tap giant "+" Button
    FE->>U: Prompt: "Photo, Voice, or Text?"
    U->>FE: Records Audio: "Dryer making scraping noise"

    FE->>G: POST /capture (Audio Blob)
    G->>DB: Create 'Inbox Item' (Status: Untriaged)

    note right of DB: Later...

    U->>FE: Review Inbox
    FE->>U: Play Audio
    U->>FE: Convert to Task -> Link to 'Dryer' Asset
```

### C. The Maintenance Loop (Automated)

The system reminds you to do the work.

```mermaid
sequenceDiagram
    participant C as Cron Service (Fly.io)
    participant N as NATS
    participant U as User
    participant A as Asset Service

    C->>N: Publish "task.due" (Payload: Filter Change)
    N->>U: Push Notification: "HVAC Filter Due"

    U->>U: Buys Filter (using App for size) & Installs
    U->>A: Click "Mark Done"
    A->>A: Log History & Reset Due Date (+90 Days)
```

---

## 4. Data Model (ERD)

The schema is designed for multi-tenancy (You + Parents) and deep asset history.

```mermaid
erDiagram
    PROPERTY ||--o{ ZONE : contains
    ZONE ||--o{ ASSET : contains

    ASSET ||--o{ TASK : requires
    ASSET ||--o{ SUPPLY : consumes
    ASSET ||--o{ LOG : history
    ASSET ||--o{ DOCUMENT : manuals

    INBOX_ITEM }|--|| USER : captured_by

    ASSET {
        string id PK
        string name "Trane Furnace"
        jsonb metadata "{ model: 'XC95', serial: '...' }"
    }

    SUPPLY {
        string id PK
        string name "Filter 20x25x4"
        string link "amazon.com/..."
        string asset_id FK
    }

    TASK {
        string id PK
        string name "Replace Filter"
        string cron "0 0 1 */3 *"
        date next_due_at
    }
```

---

## 5. UI Wireframes

**Screen 1: The Onboarding (Step 2)**

**Goal:** Solve the "Home Depot Amnesia" problem.

```plaintext
+-------------------------------------------------------+
|  < Back          Step 2 of 3                          |
+-------------------------------------------------------+
|  THE "HOME DEPOT" CHEAT SHEET                         |
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
|  🟢 HVAC System     🟢 Plumbing     🟡 Garage Door    |
+-------------------------------------------------------+
|  RECENT LOGS                                          |
|  • Replaced Kitch. Faucet (You, Yesterday)            |
|  • Added Salt (Dad, 2 days ago)                       |
+-------------------------------------------------------+
```

**Screen 3: Asset Detail (The "Supplies" View)**

**Goal:** One-tap purchasing of the right part.

```plaintext
+-------------------------------------------------------+
|  < Back             Asset Detail             [ Edit ] |
+-------------------------------------------------------+
|  Trane XC95 Furnace                                   |
|  📍 Basement Utility Room                             |
|  Status: 🟢 Operational                               |
+-------------------------------------------------------+
|  CONSUMABLES (What to buy)                            |
|  +-------------------------------------------------+  |
|  | Filter: 20x25x4 MERV 11                         |  |
|  | [ Buy on Amazon ]  [ Buy on HomeDepot ]         |  |
|  +-------------------------------------------------+  |
|  +-------------------------------------------------+  |
|  | Flame Sensor: #SEN01114                         |  |
|  | [ Buy on RepairClinic ]                         |  |
|  +-------------------------------------------------+  |
+-------------------------------------------------------+
|  SERVICE HISTORY                                      |
|  • Feb 2026: Filter Change (Regular Maint.)           |
|  • Nov 2025: Cleaned Flame Sensor (Issue Fixed)       |
+-------------------------------------------------------+
```

---

## 6. Technical Stack Reference

- Monorepo: pnpm workspaces
- Frontend: React + Vite + PWA (Deploy: Cloudflare Workers)
- Edge Gateway: NestJS + Fastify (Deploy: Cloudflare Workers)
- Message Bus: NATS JetStream (Deploy: Fly.io)
- Worker Service: NestJS Microservice (Deploy: Fly.io)
- Database: SQLite + TypeORM (Deploy: D1 Cloudflare)
- Auth: Better Auth (Hybrid Cookie/Token)
- Storage: Cloudflare R2 (for Audio/Photos)
