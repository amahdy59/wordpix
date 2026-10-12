/**
 * Unit 168: The Data Center (data-center)
 * 4 Lessons — 100% Target Vocabulary Coverage
 * CEFR Level: B2 Fluency & Work (Professional, Managerial & Infrastructure Tech English)
 * Featuring 5-character ensemble: Layla, Hana, Tariq, Adam, Omar
 */

export const DATA_CENTER_SCENARIOS = {
  unitId: "data-center",
  unitName: "The Data Center",
  cefr: "B2",
  unitNameEn: "The Data Center",
  unitNameAr: "مركز البيانات",
  lessons: [
    {
      id: "data-center-1",
      name: "The Data Center 1",
      titleEn: "Server Racks, Aisle Containment & Power Distribution",
      titleAr: "خزائن الخوادم وممرات التبريد وتوزيع الطاقة",
      setting: "Enterprise tier-4 data center floor and network core.",
      wordIds: [
        "server-rack", "blade-server", "cable-tray", "raised-floor", "hot-aisle",
        "cold-aisle", "ups", "generator", "pdu", "patch-panel",
        "switch", "router", "firewall", "load-balancer", "fiber-optic"
      ],
      lines: [
        {
          id: "01_layla_server_racks_and_aisles",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Data center architects organize high-density blade servers into modular server racks arranged along an alternating hot aisle and cold aisle containment layout."
        },
        {
          id: "02_hana_floors_and_fiber",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Underneath the perforated raised floor and overhead steel cable tray, technicians route high-speed fiber-optic cabling."
        },
        {
          id: "03_tariq_power_protection",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Continuous power is safeguarded by an industrial UPS battery bank, backup diesel generator, and smart rack PDU."
        },
        {
          id: "04_omar_switching_and_routing",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Network engineers terminate connections at the patch panel, linking the top-of-rack network switch and border router."
        },
        {
          id: "05_adam_firewalls_and_balancers",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Incoming internet traffic filters through a resilient hardware firewall before a load balancer distributes queries evenly."
        }
      ]
    },
    {
      id: "data-center-2",
      name: "The Data Center 2",
      titleEn: "Network Bandwidth, Storage Arrays & Data Replication",
      titleAr: "سعة الشبكة ومصفوفات التخزين ومزامنة البيانات",
      setting: "Network operations center and enterprise storage tier.",
      wordIds: [
        "ethernet", "bandwidth", "latency", "dns", "vpn",
        "hard-drive", "ssd", "raid", "nas", "san",
        "backup", "tape-drive", "cloud-storage", "snapshot", "replication"
      ],
      lines: [
        {
          id: "01_layla_network_performance",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "High-speed Gigabit Ethernet delivers massive bandwidth while keeping packet round-trip latency to a minimum."
        },
        {
          id: "02_hana_dns_and_vpns",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Global domain lookups resolve instantly over distributed DNS servers, while remote engineers connect through an encrypted corporate VPN."
        },
        {
          id: "03_tariq_storage_media_raid",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Storage arrays combine spinning magnetic hard drives with lightning-fast NVMe SSD disks configured in a fault-tolerant RAID array."
        },
        {
          id: "04_omar_nas_and_san",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Enterprise storage pools provision high-throughput SAN block storage and scalable network-attached NAS file shares."
        },
        {
          id: "05_adam_disaster_recovery",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Comprehensive disaster recovery incorporates regular automated backup, off-site magnetic tape drives, multi-cloud storage, point-in-time snapshots, and cross-region data replication."
        }
      ]
    },
    {
      id: "data-center-3",
      name: "The Data Center 3",
      titleEn: "HVAC Chillers, Thermal Control & Biometric Access",
      titleAr: "مبردات التكييف والتحكم الحراري والدخول البيومتري",
      setting: "Data center HVAC plant and high-security biometric vestibule.",
      wordIds: [
        "air-conditioner", "chiller", "cooling-tower", "fan", "vent",
        "heat-exchanger", "containment", "thermostat", "humidity-control", "water-cooling",
        "badge-reader", "biometric", "mantrap", "cctv", "fire-suppression"
      ],
      lines: [
        {
          id: "01_layla_cooling_infrastructure",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Climate control systems maintain thermal equilibrium with industrial air conditioners, rooftop cooling towers, closed-loop water cooling, and water chillers."
        },
        {
          id: "02_hana_fans_vents_containment",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Variable-speed exhaust fans draw hot air through overhead vents and a liquid-to-air heat exchanger within the thermal containment zone."
        },
        {
          id: "03_tariq_environmental_monitoring",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "Automated environmental sensors continuously monitor the ambient thermostat and precision humidity control."
        },
        {
          id: "04_omar_physical_access_controls",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Strict physical security controls access using an optical badge reader, biometric iris scanner, and security mantrap vestibule."
        },
        {
          id: "05_adam_cctv_fire_suppression",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "High-resolution CCTV surveillance watches every corridor, while gas fire suppression systems protect electronics without water damage."
        }
      ]
    },
    {
      id: "data-center-4",
      name: "The Data Center 4",
      titleEn: "Colocation Suites, Operational Monitoring & High Uptime",
      titleAr: "أجنحة الاستضافة المشتركة والمراقبة التشغيلية وضمان الجاهزية",
      setting: "Infrastructure operations monitoring suite and private colocation suites.",
      wordIds: [
        "access-log", "cage", "lock", "guard", "monitoring",
        "technician", "administrator", "dashboard", "alert", "uptime",
        "maintenance", "migration", "deployment", "redundancy", "failover"
      ],
      lines: [
        {
          id: "01_layla_colocation_security",
          speaker: "Layla",
          voiceId: "Xb7hH8MSUJpSbSDYk0k2",
          text: "Colocation clients secure private server cages behind a heavy physical lock, where an armed security guard audits every electronic access log."
        },
        {
          id: "02_hana_noc_dashboards",
          speaker: "Hana",
          voiceId: "cgSgspJ2msm6clMCkdW9",
          text: "Network operations center monitoring displays real-time system telemetry across a wall-sized observability dashboard."
        },
        {
          id: "03_tariq_staffing_and_alerts",
          speaker: "Tariq",
          voiceId: "JBFqnCBsd6RMkjVDRZzb",
          text: "A certified site technician inspects hardware while the systems administrator responds to any automated threshold alert."
        },
        {
          id: "04_omar_uptime_maintenance_deployment",
          speaker: "Omar",
          voiceId: "IKne3meq5aSn9XLyUdCD",
          text: "Critical enterprise services maintain 99.999% uptime through scheduled preventative maintenance, seamless cloud migration, and automated software deployment."
        },
        {
          id: "05_adam_redundancy_and_failover",
          speaker: "Adam",
          voiceId: "bIHbv24MWmeRgasZH58o",
          text: "Dual-power hardware redundancy ensures immediate transparent failover if any primary component faults."
        }
      ]
    }
  ]
};
